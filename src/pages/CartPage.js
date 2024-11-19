import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Container,
  Checkbox,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  updateCartQuantity,
  loadCart,
  removeBookFromCart,
  clearAllCartItems,
} from "../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart.cart);
  const detailedCart = useSelector((state) => state.cart.detailedCart);

  // Quản lý trạng thái chọn sách
  const [selectedItems, setSelectedItems] = useState([]);

  // Kết hợp thông tin từ `cart` và `detailedCart`
  const cartItems = detailedCart.map((book) => {
    const cartItem = cart.find((item) => item.bookId === book._id);
    return cartItem ? { ...book, quantity: cartItem.quantity } : book;
  });

  // Tính tổng tiền chỉ của sách đã chọn
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.bookId))
    .reduce(
      (total, item) =>
        total + (item.discountedPrice || item.price) * item.quantity,
      0
    );

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  // Cập nhật số lượng sách trong giỏ
  const handleUpdateQuantity = (bookId, quantity) => {
    if (quantity >= 0) {
      dispatch(updateCartQuantity({ bookId, quantity }));
    }
  };

  // Xóa sách khỏi giỏ
  const handleRemoveItem = (bookId) => {
    dispatch(removeBookFromCart(bookId));
    setSelectedItems((prev) => prev.filter((id) => id !== bookId));
  };

  // Xóa toàn bộ sách trong giỏ
  const handleClearCart = () => {
    dispatch(clearAllCartItems());
    setSelectedItems([]);
  };

  // Điều hướng tới trang thanh toán chỉ với sách đã chọn
  const handleProceedToCheckout = (useId) => {
    const selectedBooks = cartItems.filter((item) =>
      selectedItems.includes(item.bookId)
    );
    navigate(`/order/${useId}`, { state: { cartItems, totalPrice } });
  };

  // Xử lý checkbox chọn/bỏ chọn sách
  const handleCheckboxChange = (bookId) => {
    setSelectedItems((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6">Your cart is empty</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {cartItems.map((item, index) => (
                <Grid item xs={12} key={`${item.bookId}-${index}`}>
                  <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
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
                          Price: ${item.discountedPrice || item.price}
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
                              handleUpdateQuantity(item.bookId, item.quantity - 1)
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
                              handleUpdateQuantity(item.bookId, item.quantity + 1)
                            }
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        <Typography variant="body1" sx={{ marginTop: 1 }}>
                          Total: $
                          {(item.discountedPrice || item.price) * item.quantity}
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
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ marginTop: 2, width: "100%" }}
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0}
              >
                Proceed to checkout
              </Button>

              <Typography variant="body1" sx={{ my: 2, fontWeight: "bold" }}>
                or
              </Typography>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  width: "100%",
                  backgroundColor: "#FFA500",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  color: "#ffffff",
                }}
              >
                <span style={{ color: "#0000FF" }}>Pay</span>
                <span style={{ color: "#87CEEB" }}>Pal</span>
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
                Clear Cart
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;
