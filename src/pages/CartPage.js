import React, { useEffect } from "react";
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
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Add, Remove, Delete } from "@mui/icons-material";
import { updateCartQuantity, loadCart, removeBookFromCart, clearAllCartItems} from "../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const detailedCart = useSelector((state) => state.cart.detailedCart);

  const cartItems = detailedCart.map((book) => {
    const cartItem = cart.find((item) => item.bookId === book._id);
    return cartItem ? { ...book, quantity: cartItem.quantity } : book;
  });

  const totalPrice = cartItems.reduce((total, item) => total + (item.discountedPrice || item.price) * item.quantity, 0);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleUpdateQuantity = (bookId, quantity) => {
    if (!bookId || isNaN(quantity)) {
      console.error("Invalid bookId or quantity:", bookId, quantity);
      return;
    }
    if (quantity >= 0) {
      dispatch(updateCartQuantity({ bookId, quantity }));
    }
  };

  const handleRemoveItem = (bookId) => {
    dispatch(removeBookFromCart(bookId));
  };

  const handleClearCart = () => {
    dispatch(clearAllCartItems());
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6">Your bag is empty</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {cartItems.map((item, index) => (
                <Grid item xs={12} key={`${item.bookId}-${index}`}>
                  <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
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
                          Price: ${item.discountedPrice}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => handleUpdateQuantity(item.bookId, item.quantity - 1)}
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
                            onClick={() => handleUpdateQuantity(item.bookId, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        <Typography variant="body1" sx={{ marginTop: 1 }}>
                          Totals: ${(item.discountedPrice || item.price) * item.quantity}
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

          {/* Tổng số tiền và các nút thanh toán */}
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
                Totals: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ marginTop: 2, width: "100%" }}
              >
                Proceed to checkout
              </Button>

              {/* Thêm chữ "or" */}
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

              {/* Dòng chữ Clear Cart */}
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
