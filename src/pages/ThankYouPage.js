import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrderDetails,
  selectOrderDetails,
} from "../features/order/orderSlice";
import { useLocation, useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const dispatch = useDispatch();
  const { orderDetails, error, isLoading } = useSelector(
    (state) => state.order
  );
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    if (orderId && user?._id) {
      console.log(
        "Fetching order details for User ID:",
        user._id,
        "and Order ID:",
        orderId
      );
      dispatch(fetchOrderDetails({ userId: user._id, orderId }));
    }
  }, [dispatch, orderId, user?._id]);

  useEffect(() => {
    console.log("Order ID in ThankYouPage:", orderId);
    console.log("Order Details in Redux:", orderDetails);
  }, [orderDetails]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", 
        padding: 4,
        textAlign: "center", 
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "orange", 
          fontStyle: "italic", 
        }}
      >
        Thank you for shopping at Susu Anna Bookstore!
      </Typography>
      {isLoading ? (
        <Typography>Loading order details...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : orderDetails ? (
        <>
          <Typography
            variant="h6"
            sx={{ textTransform: "uppercase", fontWeight: "bold" }}
          >
            ORDER INFORMATION
          </Typography>
          <Typography>
            <strong>Order Code: {orderDetails.orderCode}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Shipping Fee: $3.00</strong>
          </Typography>
          <Typography>
            <strong>Total Amount: ${orderDetails.totalAmount}</strong>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Ordered Books:
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              maxWidth: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {orderDetails.books.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    height: "100%", 
                  }}
                >
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt={book.name}
                    sx={{
                      height: 140,
                      width: "auto",
                      objectFit: "contain",
                      marginBottom: 2, 
                    }}
                  />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" align="center">
                      {book.name}
                    </Typography>
                    <Typography align="center">
                      Quantity: {book.quantity}
                    </Typography>
                    <Typography align="center">Price: ${book.price}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")} 
        >
          Keep Buying
        </Button>
      </Box>
        </>
      ) : (
        <Typography>Order details not found.</Typography>
      )}
    </Box>
  );
};
export default ThankYouPage;
