import React from "react";
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
import { removeFromCart, updateCartQuantity } from "../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  //   const handleRemoveItem = (bookId) => {
  //     dispatch(removeFromCart(bookId));
  //   };

  const handleUpdateQuantity = (bookId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ bookId, quantity }));
    }
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
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.bookId}>
              <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                <CardMedia
                  component="img"
                  image={item.image || "/default-book.jpg"}
                  alt={item.name}
                  sx={{ width: 100, height: 150 }}
                />
                <Box sx={{ flex: 1, marginLeft: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body1">
                      Giá: ${item.discountPrice}
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
                      Tổng: ${item.totalPrice}
                    </Typography>
                  </CardContent>
                </Box>
                <IconButton
                  color="#E1306C"
                  //   onClick={() => handleRemoveItem(item.bookId)}
                >
                  <Delete />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {cartItems.length > 0 && (
        <Box sx={{ marginTop: 4, textAlign: "right" }}>
          <Typography variant="h5" gutterBottom>
            Tổng cộng: ${totalPrice.toFixed(2)}
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Tiến hành thanh toán
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
