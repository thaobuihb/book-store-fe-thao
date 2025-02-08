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

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.admin);
  console.log("Orders from Redux Store:", orders);

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
  useState("");

  const paymentStatusOptions = ["Unpaid", "Paid", "Refunded"];
  const orderStatusOptions = [
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const getAvailableShippingStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Processing":
        return ["Shipped", "Delivered", "Returned", "Cancelled"];
      case "Shipped":
        return ["Delivered", "Returned", "Cancelled"];
      case "Delivered":
        return ["Returned", "Cancelled"];
      case "Returned":
      case "Cancelled":
        return [];
      default:
        return [];
    }
  };

  const getAvailablePaymentStatus = (
    currentPaymentStatus,
    currentOrderStatus
  ) => {
    if (currentOrderStatus === "Returned" && currentPaymentStatus === "Paid") {
      return ["Refunded"];
    }
    switch (currentPaymentStatus) {
      case "Unpaid":
        return ["Paid"];
      case "Paid":
        return currentOrderStatus === "Cancelled" ? ["Refunded"] : [];
      case "Refunded":
        return [];
      default:
        return [];
    }
  };

  const availableShippingStatus = getAvailableShippingStatus(
    selectedOrder?.status
  );
  const availablePaymentStatus = getAvailablePaymentStatus(
    selectedOrder?.paymentStatus,
    selectedOrder?.status
  );

  const cannotUpdateOrder =
    getAvailableShippingStatus(selectedOrder?.status).length === 0 &&
    getAvailablePaymentStatus(selectedOrder?.paymentStatus).length === 0;

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
    setCancelOrder(order.status === "Cancelled");
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleUpdateOrderShippingStatus = () => {
    if (selectedOrder) {
      dispatch(
        updateOrderShippingStatus({
          orderId: selectedOrder._id,
          orderStatus: cancelOrder ? "Cancelled" : updatedOrderStatus,
        })
      )
        .unwrap()
        .then(() => {
          console.log("Shipping status updated successfully");
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
    if (!["Processing", "Shipped"].includes(selectedOrder?.status)) {
      console.error("Order cannot be cancelled in its current state");
      return;
    }

    dispatch(
      updateOrderShippingStatus({
        orderId: selectedOrder._id,
        orderStatus: "Cancelled",
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

  //   const handleUpdateOrder = () => {
  //     if (selectedOrder) {
  //       dispatch(
  //         updateOrderStatus({
  //           orderId: selectedOrder._id,
  //           paymentStatus: updatedPaymentStatus,
  //           orderStatus: cancelOrder ? "Cancelled" : updatedOrderStatus,
  //           shippingAddress: updatedShippingAddress,
  //         })
  //       );
  //     }
  //     handleCloseModal();
  //   };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;

    if (searchCriteria === "customerName") {
      return order.shippingAddress.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }

    if (searchCriteria === "books.Isbn") {
      return order.books.some((book) =>
        book.Isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const value = order[searchCriteria];
    return typeof value === "string"
      ? value.toLowerCase().includes(searchTerm.toLowerCase())
      : typeof value === "number" && value.toString().includes(searchTerm);
  });

  const displayedOrders = filteredOrders.filter((order) => {
    if (tabValue === 1) return order.status.toLowerCase() === "processing";
    if (tabValue === 2) return order.status.toLowerCase() === "shipped";
    if (tabValue === 3) return order.paymentStatus.toLowerCase() === "paid";
    if (tabValue === 4) return order.status.toLowerCase() === "cancelled";
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
          <MenuItem value="status">Trạng thái</MenuItem>
          <MenuItem value="books.Isbn">ISBN</MenuItem>
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
                        order.status === "Cancelled"
                          ? "red"
                          : order.status === "Delivered"
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
                        order.paymentStatus === "Paid"
                          ? "green"
                          : order.paymentStatus === "Refunded"
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

          {/* Hiển thị thông báo nếu không thể cập nhật đơn hàng */}
          {cannotUpdateOrder && (
            <Typography
              color="error"
              sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
            >
              KHÔNG THỂ CẬP NHẬT ĐƠN HÀNG
            </Typography>
          )}

          {/* Trạng thái giao hàng */}
          <Typography>Trạng thái giao hàng</Typography>
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
          {getAvailableShippingStatus(selectedOrder?.status).length === 0 && (
            <Typography color="error" sx={{ mt: 1 }}>
              Không thể cập nhật trạng thái giao hàng vì đơn hàng đã bị hủy hoặc
              trả lại.
            </Typography>
          )}

          {/* Trạng thái thanh toán */}
          <Typography sx={{ mt: 2 }}>Trạng thái thanh toán</Typography>
          {selectedOrder?.status === "Cancelled" ? (
            <Typography color="error">
              Không thể cập nhật trạng thái thanh toán vì đơn hàng đã bị hủy.
            </Typography>
          ) : getAvailablePaymentStatus(selectedOrder?.paymentStatus).length ===
            0 ? (
            <Typography color="error" sx={{ mt: 1 }}>
              Không thể cập nhật trạng thái thanh toán vì đã được hoàn tiền.
            </Typography>
          ) : (
            <Select
              fullWidth
              value={updatedPaymentStatus}
              onChange={(e) => setUpdatedPaymentStatus(e.target.value)}
              disabled={cannotUpdateOrder}
            >
              {getAvailablePaymentStatus(
                selectedOrder?.paymentStatus,
                selectedOrder?.status
              ).map((status, index) => (
                <MenuItem key={index} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Địa chỉ giao hàng */}
          <Typography sx={{ mt: 2 }}>Địa chỉ giao hàng</Typography>
          {selectedOrder?.status === "Processing" ? (
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
              Địa chỉ giao hàng chỉ có thể được cập nhật khi đơn hàng chưa gửi
              đi, nếu cần thiết thay đổi hãy gọi đơn vị vận chuyển.
            </Typography>
          )}

          {/* Nút xác nhận */}
          <Box mt={2}>
            {["Processing", "Shipped"].includes(selectedOrder?.status) &&
              !cannotUpdateOrder && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
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
                    selectedOrder.paymentStatus
                  ).includes(updatedPaymentStatus)
                ) {
                  handleUpdateOrderPaymentStatus();
                }

                if (
                  JSON.stringify(updatedShippingAddress) !==
                    JSON.stringify(selectedOrder.shippingAddress) &&
                  selectedOrder.status === "Processing"
                ) {
                  handleUpdateShippingAddress();
                }
              }}
              disabled={cannotUpdateOrder}
            >
              Xác nhận cập nhật
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default OrdersPage;
