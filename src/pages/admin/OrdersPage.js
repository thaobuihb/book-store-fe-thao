import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Modal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrders,
  //   updateOrderStatus,
  updateOrderPaymentStatus,
  updateOrderShippingStatus,
  updateShippingAddress,
} from "../../features/admin/adminSlice";
import { useTranslation } from "react-i18next";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.admin);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("customerName");
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState("");
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState("");
  const [cancelOrder, setCancelOrder] = useState(false);
  const [updatedShippingAddress, setUpdatedShippingAddress] = useState({});
  const [updatedShippingStatus, setUpdatedShippingStatus] = useState("");

  const getAvailableShippingStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Đang xử lý":
        return ["Đã giao hàng", "Đã nhận hàng", "Trả hàng", "Đã hủy"];
      case "Đã giao hàng":
        return ["Đã nhận hàng", "Trả hàng", "Đã hủy"];
      case "Đã nhận hàng":
        return ["Trả hàng", "Đã hủy"];
      case "Trả hàng":
      case "Đã hủy":
        return [];
      default:
        return [];
    }
  };

  const getAvailablePaymentStatus = (
    currentPaymentStatus,
    currentOrderStatus
  ) => {
    if (
      ["Trả hàng", "Đã hủy"].includes(currentOrderStatus) &&
      currentPaymentStatus === "Đã thanh toán"
    ) {
      return ["Đã hoàn tiền"];
    }
    if (
      currentOrderStatus === "Đã nhận hàng" &&
      currentPaymentStatus === "Đã thanh toán"
    ) {
      return ["Đã hoàn tiền"];
    }
    if (currentPaymentStatus === "Chưa thanh toán") {
      return ["Đã thanh toán"];
    }

    return [];
  };

  const availablePaymentStatus = getAvailablePaymentStatus(
    selectedOrder?.paymentStatus,
    selectedOrder?.status
  );

  const cannotUpdateOrder =
    getAvailableShippingStatus(selectedOrder?.status).length === 0 &&
    getAvailablePaymentStatus(
      selectedOrder?.paymentStatus,
      selectedOrder?.status
    ).length === 0;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSearchCriteriaChange = (e) => setSearchCriteria(e.target.value);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setUpdatedShippingStatus(order.shippingAddress);
    setUpdatedPaymentStatus(order.paymentStatus);
    setUpdatedShippingAddress(order.shippingAddress);
    setUpdatedOrderStatus(order.status);
    setCancelOrder(order.status === "Đã hủy");
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleUpdateOrderShippingStatus = () => {
    if (selectedOrder) {
      dispatch(
        updateOrderShippingStatus({
          orderId: selectedOrder._id,
          orderStatus: cancelOrder ? "Đã hủy" : updatedOrderStatus,
        })
      )
        .unwrap()
        .then(() => {
          console.log("Shipping status updated successfully");
          dispatch(fetchOrders());
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Failed to update shipping status:", error);
        });
    }
  };

  const handleUpdateOrderPaymentStatus = () => {
    if (selectedOrder) {
      dispatch(
        updateOrderPaymentStatus({
          orderId: selectedOrder._id,
          paymentStatus: updatedPaymentStatus,
        })
      )
        .unwrap()
        .then(() => {
          console.log("Payment status updated successfully");
          dispatch(fetchOrders());
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Failed to update payment status:", error);
        });
    }
  };

  const handleUpdateShippingAddress = () => {
    if (selectedOrder && updatedShippingAddress) {
      dispatch(
        updateShippingAddress({
          userId: selectedOrder.userId,
          orderId: selectedOrder._id,
          shippingAddress: updatedShippingAddress,
        })
      )
        .unwrap()
        .then(() => {
          console.log("Shipping address updated successfully");
          dispatch(fetchOrders());
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Failed to update shipping address:", error);
        });
    } else {
      console.error("Selected order or shipping address is invalid.");
    }
  };

  const handleCancelOrder = () => {
    if (!["Đang xử lý", "Đã giao hàng"].includes(selectedOrder?.status)) {
      console.error("Order cannot be cancelled in its current state");
      return;
    }

    dispatch(
      updateOrderShippingStatus({
        orderId: selectedOrder._id,
        orderStatus: "Đã hủy",
      })
    )
      .unwrap()
      .then(() => {
        console.log("Order cancelled successfully");
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Failed to cancel order:", error);
      });
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;

    const lowerSearchTerm = searchTerm.toLowerCase();

    if (searchCriteria === "customerName") {
      return order.shippingAddress.fullName
        .toLowerCase()
        .includes(lowerSearchTerm);
    }

    if (searchCriteria === "orderCode") {
      return order.orderCode.toLowerCase().includes(lowerSearchTerm);
    }

    if (searchCriteria === "paymentStatus") {
      return order.paymentStatus.toLowerCase().includes(lowerSearchTerm);
    }

    if (searchCriteria === "status") {
      return order.status.toLowerCase().includes(lowerSearchTerm);
    }

    return false;
  });

  // Kết hợp với tab lọc đơn hàng
  const displayedOrders = filteredOrders.filter((order) => {
    if (tabValue === 1) return order.status === "Đang xử lý";
    if (tabValue === 2) return order.status === "Đã giao hàng";
    if (tabValue === 3) return order.paymentStatus === "Đã thanh toán";
    if (tabValue === 4) return order.status === "Đã hủy";
    return true;
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container>
      {/* Tabs lọc đơn hàng */}
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Tất cả đơn hàng" />
        <Tab label="Đơn đang xử lý" />
        <Tab label="Đơn hàng đã gửi đi" />
        <Tab label="Đơn hàng đã thanh toán" />
        <Tab label="Đơn hàng đã bị huỷ" />
      </Tabs>

      {/* Thanh tìm kiếm */}
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        mt={2}
      >
        <Select value={searchCriteria} onChange={handleSearchCriteriaChange}>
          <MenuItem value="customerName">Tên khách hàng</MenuItem>
          <MenuItem value="orderCode">Mã đơn hàng</MenuItem>
          <MenuItem value="status">Trạng thái giao hàng</MenuItem>
          <MenuItem value="paymentStatus">Trạng thái thanh toán</MenuItem>
        </Select>
        <TextField
          label="Tìm kiếm đơn hàng"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: "300px", marginLeft: "10px" }}
        />
      </Box>

      {/* Bảng danh sách đơn hàng */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái giao hàng</TableCell>
              <TableCell>Trạng thái thanh toán</TableCell>
              <TableCell>Thông tin chi tiết</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.orderCode || "N/A"}</TableCell>
                <TableCell>
                  {order.shippingAddress.fullName || "Không rõ"}
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color:
                        order.status === "Đã hủy"
                          ? "red"
                          : order.status === "Đã nhận hàng"
                          ? "green"
                          : "blue",
                      fontWeight: "bold",
                    }}
                  >
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color:
                        order.paymentStatus === "Đã thanh toán"
                          ? "green"
                          : order.paymentStatus === "Đã hoàn tiền"
                          ? "orange"
                          : "purple",
                      fontWeight: "bold",
                    }}
                  >
                    {order.paymentStatus}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Thông tin chi tiết</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="h6" mb={2}>
                        📚 Chi tiết sách
                      </Typography>
                      {order.books.map((book, index) => (
                        <Box
                          key={index}
                          p={1}
                          border="1px solid #ddd"
                          borderRadius="8px"
                          mb={2}
                        >
                          <Typography>
                            <b>Tên sách:</b> {book.name}
                          </Typography>
                          <Typography>
                            <b>ISBN:</b> {book.Isbn || "Không có ISBN"}
                          </Typography>
                          <Typography>
                            <b>Số lượng:</b> {book.quantity}
                          </Typography>
                          <Typography>
                            <b>Giá:</b> ${book.price.toFixed(2)}
                          </Typography>
                          <Typography>
                            <b>Tổng:</b> $
                            {(book.price * book.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                      <Typography variant="h6" mt={2}>
                        👤 Thông tin người mua
                      </Typography>
                      <Typography>
                        <b>Họ và tên:</b> {order.shippingAddress.fullName}
                      </Typography>
                      <Typography>
                        <b>Email:</b> {order.customerEmail}
                      </Typography>
                      <Typography>
                        <b>Số điện thoại:</b> {order.shippingAddress.phone}
                      </Typography>
                      <Typography>
                        <b>Địa chỉ:</b>{" "}
                        {`${order.shippingAddress.country}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.ward}, ${order.shippingAddress.addressLine}`}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenModal(order)}
                  >
                    Cập nhật
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal cập nhật đơn hàng */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          p={4}
          style={{
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Cập nhật đơn hàng
          </Typography>

          {/* Nếu đơn hàng đã trả hàng hoặc đã hủy, chỉ hiển thị thông báo lỗi */}
          {["Trả hàng", "Đã hủy"].includes(selectedOrder?.status) ? (
            <>
              <Typography
                color="error"
                sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
              >
                KHÔNG THỂ CẬP NHẬT ĐƠN HÀNG
              </Typography>
              <Typography color="error" sx={{ textAlign: "center" }}>
                Không thể cập nhật trạng thái giao hàng vì đơn hàng đã{" "}
                {selectedOrder?.status.toLowerCase()}.
              </Typography>
            </>
          ) : (
            <>
              {/* Trạng thái giao hàng */}
              <Typography sx={{ mt: 2 }}>Trạng thái giao hàng</Typography>
              <Select
                fullWidth
                value={updatedOrderStatus}
                onChange={(e) => setUpdatedOrderStatus(e.target.value)}
                disabled={cannotUpdateOrder}
              >
                {getAvailableShippingStatus(selectedOrder?.status).map(
                  (status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  )
                )}
              </Select>

              {/* Nếu không thể cập nhật trạng thái giao hàng */}
              {getAvailableShippingStatus(selectedOrder?.status).length ===
                0 && (
                <Typography color="error" sx={{ mt: 1 }}>
                  Không thể cập nhật trạng thái giao hàng vì đơn hàng đã bị hủy
                  hoặc trả lại.
                </Typography>
              )}

              <Typography sx={{ mt: 2 }}>Trạng thái thanh toán</Typography>
              {availablePaymentStatus.length === 0 ? (
                <Typography color="error">
                  {selectedOrder?.status === "Đã hủy" ||
                  selectedOrder?.status === "Trả hàng"
                    ? "Trạng thái thanh toán đã được cập nhật tự động do đơn hàng bị hủy hoặc trả hàng."
                    : "Không có trạng thái thanh toán nào có thể cập nhật."}
                </Typography>
              ) : (
                <Select
                  fullWidth
                  value={updatedPaymentStatus}
                  onChange={(e) => setUpdatedPaymentStatus(e.target.value)}
                >
                  {availablePaymentStatus.map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {/* 📍 Địa chỉ giao hàng (chỉ cập nhật khi đơn hàng đang xử lý) */}
              <Typography sx={{ mt: 2 }}>{t("address")}</Typography>
              {selectedOrder?.status === "Đang xử lý" ? (
                Object.keys(updatedShippingAddress).map((key, index) => (
                  <TextField
                    key={index}
                    label={key}
                    value={updatedShippingAddress[key]}
                    onChange={(e) =>
                      setUpdatedShippingAddress({
                        ...updatedShippingAddress,
                        [key]: e.target.value,
                      })
                    }
                    fullWidth
                    sx={{ mt: 1 }}
                    disabled={cannotUpdateOrder}
                  />
                ))
              ) : (
                <Typography color="error" sx={{ mt: 2 }}>
                  Địa chỉ giao hàng chỉ có thể được cập nhật khi đơn hàng chưa
                  gửi đi.
                </Typography>
              )}

              {/* 🚀 Nút xác nhận cập nhật */}
              <Box mt={2}>
                {["Đang xử lý", "Đã giao hàng"].includes(
                  selectedOrder?.status
                ) &&
                  !cannotUpdateOrder && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancelOrder}
                    >
                      {t("cancelOrder")}
                    </Button>
                  )}

                <Button
                  variant="contained"
                  sx={{ ml: 2 }}
                  onClick={() => {
                    if (cannotUpdateOrder) return;

                    if (
                      updatedOrderStatus &&
                      updatedOrderStatus !== selectedOrder.status &&
                      getAvailableShippingStatus(selectedOrder.status).includes(
                        updatedOrderStatus
                      )
                    ) {
                      handleUpdateOrderShippingStatus();
                    }

                    if (
                      updatedPaymentStatus &&
                      updatedPaymentStatus !== selectedOrder.paymentStatus &&
                      getAvailablePaymentStatus(
                        selectedOrder.paymentStatus,
                        selectedOrder.status
                      ).includes(updatedPaymentStatus)
                    ) {
                      handleUpdateOrderPaymentStatus();
                    }

                    if (
                      JSON.stringify(updatedShippingAddress) !==
                        JSON.stringify(selectedOrder.shippingAddress) &&
                      selectedOrder.status === "Đang xử lý"
                    ) {
                      handleUpdateShippingAddress();
                    }
                  }}
                  disabled={cannotUpdateOrder}
                >
                  Xác nhận cập nhật
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default OrdersPage;
