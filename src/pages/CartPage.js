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
import {
  searchOrderByCode,
  clearSearchResult,
  cancelGuestOrder,
} from "../features/order/orderSlice";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(0);

  const cart = useSelector(selectCartItems);
  const detailedCart = useSelector(selectDetailedCart);
  const cartReloadTrigger = useSelector(selectCartReloadTrigger);
  const purchaseHistory = useSelector(selectPurchaseHistory);
  const user = useSelector((state) => state.user?.user || null);
  const { t } = useTranslation();

  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

  const { searchResult, searchError } = useSelector((state) => state.order);

  const [searchQuery, setSearchQuery] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const isAuthenticated =
    useSelector((state) => state.auth?.isAuthenticated) ?? false;

  useEffect(() => {
    dispatch(loadCart());
    if (user?._id) {
      // console.log("Fetching purchase history for user:#########", user._id);
      dispatch(fetchPurchaseHistory(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      console.log("🔄 Fetching purchase history and cart...");
      dispatch(loadCart());
      dispatch(fetchPurchaseHistory(user._id));
    }
  }, [isAuthenticated, user?._id, dispatch]);

  useEffect(() => {
    if (cartReloadTrigger) {
      dispatch(loadCart());
    }
  }, [cartReloadTrigger, dispatch]);

  useEffect(() => {
    const allBookIds = cart.map((item) => item.bookId);
    setSelectedItems(allBookIds);
  }, [cart]);

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

  useEffect(() => {
    if (!isAuthenticated) {
      setSearchQuery("");
    }
  }, [isAuthenticated]);

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

  const handleOpenModal = (orderIdOrCode) => {
    setSelectedOrderId(orderIdOrCode);
    setOpenModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrderId(null);
  };

  // Xác nhận hủy đơn hàng
  const handleConfirmCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      if (user?._id) {
        // 🔥 Người dùng ĐÃ đăng nhập -> Hủy bằng userId + orderId
        console.log(
          "🚀 Hủy đơn hàng cho người dùng đăng nhập:",
          selectedOrderId
        );
        await dispatch(
          cancelOrder({ userId: user._id, orderId: selectedOrderId })
        ).unwrap();
        dispatch(fetchPurchaseHistory(user._id)); // Cập nhật lịch sử mua hàng
      } else {
        // 🔥 Khách chưa đăng nhập -> Hủy bằng orderCode
        console.log(
          "🚀 Hủy đơn hàng cho khách chưa đăng nhập:",
          selectedOrderId
        );
        await dispatch(
          cancelGuestOrder({ orderCode: selectedOrderId })
        ).unwrap();
      }

      // 🔄 Nếu có tìm kiếm, cập nhật lại kết quả
      if (searchQuery.trim()) {
        dispatch(searchOrderByCode(searchQuery));
      }
    } catch (error) {
      console.error("❌ Lỗi khi hủy đơn hàng:", error);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại.");
    }

    // 🛑 Đóng modal sau khi hoàn thành
    handleCloseModal();
  };

  return (
    <Container id="cart-page-container" tabIndex="-1">
      <Typography variant="h4" gutterBottom>
        {t("cartTitle")}
      </Typography>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="Cart and Purchase History"
      >
        <Tab label={t("cartTab")} id="tab-0" aria-controls="tabpanel-0" />
        <Tab label={t("historyTab")} id="tab-1" aria-controls="tabpanel-1" />
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
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                {t("emptyCart")}
              </Typography>

              {/* Nút Xem Tiếp */}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => navigate("/")}
              >
                {t("addMore")}
              </Button>
            </Box>
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
                              {t("price")}:${item.discountedPrice || item.price}
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
                              {t("total")}: $
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
                    {t("total")}: ${totalPrice.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ marginTop: 2, width: "100%" }}
                    onClick={handleProceedToCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    {t("checkout")}
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
                    {t("clearCart")}
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
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, mt: 2 }}
          >
            <TextField
              label={t("orderSearchPlaceholder")}
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              {t("search")}
            </Button>
            {searchResult && searchResult.orderCode && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearSearch}
              >
                {t("clearSearch")}
              </Button>
            )}
          </Box>

          {/* Hiển thị lỗi nếu có */}
          {searchError && <Typography color="error">{searchError}</Typography>}

          {/* Hiển thị kết quả tìm kiếm nếu tìm thấy đơn hàng */}
          {searchResult && searchResult.orderCode ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h8">
                      {t("orderCode")}:{" "}
                      <strong>{searchResult.orderCode}</strong>
                    </Typography>
                    <Typography>
                      {t("status")}:{" "}
                      <strong
                        style={{
                          color: statusColors[searchResult.status] || "black",
                        }}
                      >
                        {searchResult.status}
                      </strong>
                    </Typography>
                    <Typography>
                      {t("orderDate")}:{" "}
                      {new Date(searchResult.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      {t("total")}: $
                      {searchResult?.totalAmount
                        ? searchResult.totalAmount.toFixed(2)
                        : "0.00"}
                    </Typography>

                    {/* Hiển thị sách trong đơn hàng */}
                    <Typography sx={{ mt: 2 }}>
                      <strong>{t("address")}:</strong>
                    </Typography>
                    <Typography>
                      {searchResult?.shippingAddress?.fullName || t("noName")}
                    </Typography>
                    <Typography>
                      {searchResult?.shippingAddress?.phone || t("noPhone")}
                    </Typography>
                    <Typography>
                      {searchResult?.shippingAddress
                        ? `${
                            searchResult.shippingAddress.addressLine ||
                            t("noAddress")
                          }, 
       ${searchResult.shippingAddress.city || t("noAddress")}, 
       ${searchResult.shippingAddress.state || t("noAddress")}, 
       ${searchResult.shippingAddress.zipcode || t("noZip")}, 
       ${searchResult.shippingAddress.country || t("noCountry")}`
                        : t("noAddress")}
                    </Typography>
                    {Array.isArray(searchResult?.books) &&
                    searchResult.books.length > 0 ? (
                      <>
                        <Typography sx={{ mt: 2 }}>{t("cart.book")}:</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 1,
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={
                              searchResult.books[0].bookId?.img ||
                              "/default-book.jpg"
                            }
                            alt={
                              searchResult.books[0].bookId?.name ||
                              "Sách không có tên"
                            }
                            sx={{ width: 50, height: 50, marginRight: 2 }}
                          />
                          <Box>
                            <Typography>
                              {searchResult.books[0]?.bookId?.name ||
                                "Không có tên"}
                            </Typography>
                            <Typography>
                              {t("order.price")}: $
                              {searchResult.books[0]?.price
                                ? searchResult.books[0].price.toFixed(2)
                                : "0.00"}
                            </Typography>
                            <Typography>
                              {t("order.quantity")}:{" "}
                              {searchResult.books[0].quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    ) : null}
                    {/* Nếu có nhiều sách, thêm nút "Xem thêm" */}
                    {Array.isArray(searchResult?.books) &&
                      searchResult.books.length > 1 && (
                        <Button
                          variant="text"
                          size="small"
                          sx={{ marginTop: 1, textTransform: "none" }}
                          onClick={() => toggleExpand(searchResult?._id)}
                        >
                          {expandedOrders[searchResult?._id]
                            ? t("cart.showLess")
                            : t("cart.showMore")}
                        </Button>
                      )}

                    {/* Nếu mở rộng, hiển thị toàn bộ sách */}
                    {expandedOrders[searchResult._id] &&
                      searchResult.books.slice(1).map((book, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 1,
                            paddingLeft: 2,
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
                            <Typography>
                              {t("order.price")}: ${book.price.toFixed(2)}
                            </Typography>
                            <Typography>
                              {t("order.quantity")}: {book.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    {searchResult.status === "Đang xử lý" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ marginTop: 2 }}
                        onClick={() =>
                          handleOpenModal(
                            user?._id
                              ? searchResult._id
                              : searchResult.orderCode
                          )
                        }
                      >
                        {t("cancelOrder")}
                      </Button>
                    )}
                    {/* Modal Xác Nhận Huỷ Đơn */}
                    <Dialog open={openModal} onClose={handleCloseModal}>
                      <DialogTitle>{t("confirmCancel")}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {t("confirmCancelText")}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                          {t("no")}
                        </Button>
                        <Button
                          onClick={handleConfirmCancelOrder}
                          color="error"
                          variant="contained"
                        >
                          {t("confirmCancel")}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            /* Nếu không có kết quả tìm kiếm, hiển thị danh sách đơn hàng */
            <>
              {processedOrders.length === 0 ? (
                <Typography>{t("cart.noOrderHistory")}</Typography>
              ) : (
                <Grid container spacing={2}>
                  {processedOrders.map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order._id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h8">
                            {t("")}: <strong>{order.orderCode}</strong>
                          </Typography>
                          <Typography>
                            {t("status")}:{" "}
                            <strong
                              style={{
                                color: statusColors[order.status] || "black",
                              }}
                            >
                              {order.status}
                            </strong>
                          </Typography>
                          <Typography>
                            {t("orderDate")}:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography>
                            {t("total")}: $
                            {order?.totalAmount
                              ? order.totalAmount.toFixed(2)
                              : "0.00"}
                          </Typography>
                          <Typography sx={{ mt: 2 }}>
                            <strong>{t("address")}:</strong>
                          </Typography>
                          <Typography>
                            {order.shippingAddress.fullName}
                          </Typography>
                          <Typography>{order.shippingAddress.phone}</Typography>
                          <Typography>
                            {order.shippingAddress.addressLine},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state},{" "}
                            {order.shippingAddress.zipcode},{" "}
                            {order.shippingAddress.country}
                          </Typography>

                          <Typography sx={{ mt: 2 }}>{t("cart.book")}:</Typography>
                          {/* Hiển thị sách đầu tiên */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: 1,
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={
                                order.firstBook.bookId?.img ||
                                "/default-book.jpg"
                              }
                              alt={order.firstBook.bookId?.name}
                              sx={{ width: 50, height: 50, marginRight: 2 }}
                            />
                            <Box>
                              <Typography>
                                {order.firstBook.bookId?.name}
                              </Typography>
                              <Typography>
                                {t("price")}: ${order.firstBook.price.toFixed(2)}
                              </Typography>
                              <Typography>
                                {t("order.quantity")}: {order.firstBook.quantity}
                              </Typography>
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
                              {expandedOrders[order._id]
                                 ? t("cart.showLess")
                                 : t("cart.showMore")}
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
                                  image={
                                    book.bookId?.img || "/default-book.jpg"
                                  }
                                  alt={book.bookId?.name}
                                  sx={{ width: 50, height: 50, marginRight: 2 }}
                                />
                                <Box>
                                  <Typography>{book.bookId?.name}</Typography>
                                  <Typography>
                                    {t("price")}: ${book.price.toFixed(2)}
                                  </Typography>
                                  <Typography>
                                    {t("")}: {book.quantity}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}

                          {order.status === "Đang xử lý" && (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ marginTop: 2 }}
                              onClick={() =>
                                handleOpenModal(order._id || order.orderCode)
                              }
                            >
                              {t("cancelOrder")}
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
        <DialogTitle>{t("cart.deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("cart.deleteConfirmText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            {t("no")}
          </Button>
          <Button
            onClick={handleConfirmCancelOrder}
            color="error"
            variant="contained"
          >
            {t("cart.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;
