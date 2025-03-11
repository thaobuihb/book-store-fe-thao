import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Checkbox,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadCart,
  updateCartQuantity,
  removeBookFromCart,
  clearAllCartItems,
} from "../features/cart/cartSlice";
import {
  fetchPurchaseHistory,
  cancelOrder,
} from "../features/order/orderSlice";

import {
  selectCartItems,
  selectDetailedCart,
  selectCartReloadTrigger,
} from "../features/cart/selectors";
import { selectPurchaseHistory } from "../features/order/orderSelectors";
import { searchOrderByCode, clearSearchResult } from "../features/order/orderSlice";


const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(0);

  const cart = useSelector(selectCartItems);
  const detailedCart = useSelector(selectDetailedCart);
  const cartReloadTrigger = useSelector(selectCartReloadTrigger);
  const purchaseHistory = useSelector(selectPurchaseHistory);
  const { user } = useSelector((state) => state.user);

  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

  const { searchResult, searchError, loading } = useSelector((state) => state.order);
  const [searchQuery, setSearchQuery] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);


  useEffect(() => {
    dispatch(loadCart());
    if (user?._id) {
      // console.log("Fetching purchase history for user:#########", user._id);
      dispatch(fetchPurchaseHistory(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (cartReloadTrigger) {
      dispatch(loadCart());
    }
  }, [cartReloadTrigger, dispatch]);

  useEffect(() => {
    const allBookIds = cart.map((item) => item.bookId);
    setSelectedItems(allBookIds);
  }, [cart]);


  useEffect(() => {
    console.log("🔍 Kết quả tìm kiếm trong Redux:", searchResult);
  }, [searchResult]);

  const cartItems = detailedCart.map((book) => {
    const cartItem = cart.find((item) => item.bookId === book._id);
    return cartItem ? { ...book, quantity: cartItem.quantity } : book;
  });

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.bookId))
    .reduce(
      (total, item) =>
        total + (item.discountedPrice || item.price) * item.quantity,
      0
    );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    const container = document.getElementById("cart-page-container");
    if (container) {
      container.focus();
    }
  };

  const handleUpdateQuantity = (bookId, quantity) => {
    if (quantity >= 0) {
      dispatch(updateCartQuantity({ bookId, quantity }));
    }
  };

  const handleRemoveItem = (bookId) => {
    dispatch(removeBookFromCart(bookId));
    setSelectedItems((prev) => prev.filter((id) => id !== bookId));
  };

  const handleClearCart = () => {
    dispatch(clearAllCartItems());
    setSelectedItems([]);
  };

  const handleProceedToCheckout = (useId) => {
    const selectedBooks = cartItems.filter((item) =>
      selectedItems.includes(item.bookId)
    );
    const totalAmount = selectedBooks.reduce(
      (total, item) =>
        total + (item.discountedPrice || item.price) * item.quantity,
      0
    );
    navigate(`/order/${useId}`, {
      state: { items: selectedBooks, totalAmount },
    });
  };

  const handleCheckboxChange = (bookId) => {
    setSelectedItems((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to cancel this order?"
      );
      if (!confirmation) return;

      if (user?._id) {
        await dispatch(cancelOrder({ userId: user._id, orderId })).unwrap();
        dispatch(fetchPurchaseHistory(user._id));
        alert("Order has been cancelled successfully!");
      } else {
        alert("You need to be logged in to cancel an order.");
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel the order. Please try again later.");
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const processedOrders = purchaseHistory
    .map((order) => {
      const firstBook = order.books[0];
      return firstBook ? { ...order, firstBook } : null;
    })
    .filter(Boolean);

  const statusColors = {
    "Đang xử lý": "orange",
    "Đã giao hàng": "blue",
    "Đã nhận hàng": "green",
    "Trả hàng": "red",
    "Đã hủy": "red",
  };

  //tim kiem
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Vui lòng nhập mã đơn hàng!");
      return;
    }
  
    dispatch(searchOrderByCode(searchQuery));
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(clearSearchResult());
  };


  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrderId(null);
  };

  // Xác nhận hủy đơn hàng
  const handleConfirmCancelOrder = async () => {
    if (selectedOrderId && user?._id) {
      try {
        await dispatch(cancelOrder({ userId: user._id, orderId: selectedOrderId })).unwrap();
        dispatch(fetchPurchaseHistory(user._id)); 
      } catch (error) {
        console.error("Failed to cancel order:", error);
        alert("Failed to cancel the order. Please try again later.");
      }
    }
    handleCloseModal();
  };

  return (
    <Container id="cart-page-container" tabIndex="-1">
      <Typography variant="h4" gutterBottom>
        Mua hàng
      </Typography>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="Cart and Purchase History"
      >
        <Tab label="Your Cart" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Purchase History" id="tab-1" aria-controls="tabpanel-1" />
      </Tabs>

      <Box
        id="tabpanel-0"
        role="tabpanel"
        hidden={currentTab !== 0}
        aria-labelledby="tab-0"
      >
        {/* Nội dung của Your Cart */}
      </Box>
      <Box
        id="tabpanel-1"
        role="tabpanel"
        hidden={currentTab !== 1}
        aria-labelledby="tab-1"
      >
        {/* Nội dung của Purchase History */}
      </Box>

      {currentTab === 0 && (
        <>
          {cartItems.length === 0 ? (
            <Typography variant="h6">Your cart is empty</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  {cartItems.map((item, index) => (
                    <Grid item xs={12} key={`${item.bookId}-${index}`}>
                      <Card
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <Checkbox
                          checked={selectedItems.includes(item.bookId)}
                          onChange={() => handleCheckboxChange(item.bookId)}
                        />
                        <CardMedia
                          component="img"
                          image={item.img || "/default-book.jpg"}
                          alt={item.name}
                          sx={{ width: 100, height: 150 }}
                        />
                        <Box sx={{ flex: 1, marginLeft: 2 }}>
                          <CardContent>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body1">
                              Giá: ${item.discountedPrice || item.price}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 1,
                              }}
                            >
                              <IconButton
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.bookId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Remove />
                              </IconButton>
                              <Typography
                                variant="body1"
                                sx={{
                                  padding: "0 10px",
                                  minWidth: 30,
                                  textAlign: "center",
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.bookId,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Add />
                              </IconButton>
                            </Box>
                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                              Tổng: $
                              {(item.discountedPrice || item.price) *
                                item.quantity}
                            </Typography>
                          </CardContent>
                        </Box>
                        <IconButton
                          sx={{ color: "#FF0000" }}
                          onClick={() => handleRemoveItem(item.bookId)}
                        >
                          <Delete />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    padding: 3,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Tổng: ${totalPrice.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ marginTop: 2, width: "100%" }}
                    onClick={handleProceedToCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    Thanh toán
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: 2,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={handleClearCart}
                  >
                    XOÁ
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </>
      )}

{currentTab === 1 && (
  <Box>
    {/* Ô tìm kiếm đơn hàng */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <TextField
        label="Nhập mã đơn hàng"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
      {searchResult && (
        <Button variant="outlined" color="secondary" onClick={handleClearSearch}>
          Xóa tìm kiếm
        </Button>
      )}
    </Box>

    {/* Hiển thị lỗi nếu có */}
    {searchError && <Typography color="error">{searchError}</Typography>}

    {/* Hiển thị kết quả tìm kiếm nếu tìm thấy đơn hàng */}
    {searchResult ? (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h8">
                Mã đơn hàng: <strong>{searchResult.orderCode}</strong>
              </Typography>
              <Typography>
                Trạng thái:{" "}
                <strong
                  style={{
                    color: statusColors[searchResult.status] || "black",
                  }}
                >
                  {searchResult.status}
                </strong>
              </Typography>
              <Typography>
                Ngày đặt: {new Date(searchResult.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>
                Tổng: ${searchResult.totalAmount.toFixed(2)}
              </Typography>

              {/* Hiển thị sách trong đơn hàng */}
              {searchResult.books.map((book, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <CardMedia
                    component="img"
                    image={book.bookId?.img || "/default-book.jpg"}
                    alt={book.bookId?.name}
                    sx={{ width: 50, height: 50, marginRight: 2 }}
                  />
                  <Box>
                    <Typography>{book.bookId?.name}</Typography>
                    <Typography>Giá: ${book.price.toFixed(2)}</Typography>
                    <Typography>Số lượng: {book.quantity}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    ) : (
      /* Nếu không có kết quả tìm kiếm, hiển thị danh sách đơn hàng */
      <>
        {processedOrders.length === 0 ? (
          <Typography>Bạn không có đơn hàng nào</Typography>
        ) : (
          <Grid container spacing={2}>
            {processedOrders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h8">
                      Mã đơn hàng: <strong>{order.orderCode}</strong>
                    </Typography>
                    <Typography>
                      Trạng thái:{" "}
                      <strong
                        style={{
                          color: statusColors[order.status] || "black",
                        }}
                      >
                        {order.status}
                      </strong>
                    </Typography>
                    <Typography>
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      Tổng: ${order.totalAmount.toFixed(2)}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      <strong>Địa chỉ giao hàng:</strong>
                    </Typography>
                    <Typography>{order.shippingAddress.fullName}</Typography>
                    <Typography>{order.shippingAddress.phone}</Typography>
                    <Typography>
                      {order.shippingAddress.addressLine},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state},{" "}
                      {order.shippingAddress.zipcode},{" "}
                      {order.shippingAddress.country}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>Book:</Typography>
                    {/* Hiển thị sách đầu tiên */}
                    <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                      <CardMedia
                        component="img"
                        image={order.firstBook.bookId?.img || "/default-book.jpg"}
                        alt={order.firstBook.bookId?.name}
                        sx={{ width: 50, height: 50, marginRight: 2 }}
                      />
                      <Box>
                        <Typography>{order.firstBook.bookId?.name}</Typography>
                        <Typography>Giá: ${order.firstBook.price.toFixed(2)}</Typography>
                        <Typography>Số lượng: {order.firstBook.quantity}</Typography>
                      </Box>
                    </Box>

                    {/* Nếu có nhiều hơn một sách, hiển thị nút "Xem thêm" */}
                    {order.books.length > 1 && (
                      <Button
                        variant="text"
                        size="small"
                        sx={{ marginTop: 1, textTransform: "none" }}
                        onClick={() => toggleExpand(order._id)}
                      >
                        {expandedOrders[order._id] ? "Thu gọn" : "Xem thêm"}
                      </Button>
                    )}

                    {/* Nếu mở rộng, hiển thị toàn bộ sách */}
                    {expandedOrders[order._id] &&
                      order.books.slice(1).map((book, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 1,
                            paddingLeft: 2, // Tạo khoảng cách để phân biệt sách mở rộng
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={book.bookId?.img || "/default-book.jpg"}
                            alt={book.bookId?.name}
                            sx={{ width: 50, height: 50, marginRight: 2 }}
                          />
                          <Box>
                            <Typography>{book.bookId?.name}</Typography>
                            <Typography>Giá: ${book.price.toFixed(2)}</Typography>
                            <Typography>Số lượng: {book.quantity}</Typography>
                          </Box>
                        </Box>
                      ))}

                    {order.status === "Đang xử lý" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ marginTop: 2 }}
                        onClick={() => handleOpenModal(order._id)}
                      >
                        Huỷ đơn
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </>
    )}
  </Box>
)}
{/* Modal Xác Nhận Huỷ Đơn */}
<Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Xác nhận huỷ đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn huỷ đơn hàng này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Không
          </Button>
          <Button onClick={handleConfirmCancelOrder} color="error" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;
