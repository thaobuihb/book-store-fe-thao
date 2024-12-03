import React, { useEffect } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails, selectOrderDetails } from "../features/order/orderSlice";
import { useLocation } from "react-router-dom";

const ThankYouPage = () => {
  
  const location = useLocation();
  const { orderId } = location.state || {};
  const dispatch = useDispatch();
  const { orderDetails, isLoading, error } = useSelector((state) => state.orders || {});

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails({ userId: "currentUserId", orderId }));
    }
  }, [dispatch, orderId]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cảm ơn bạn đã đặt hàng tại Susu Anna Bookstore!
      </Typography>
      {isLoading ? (
        <Typography>Đang tải thông tin đơn hàng...</Typography>
      ) : error ? (
        <Typography color="error">Lỗi: {error}</Typography>
      ) : orderDetails ? (
        <>
          <Typography variant="h6">Thông tin đơn hàng:</Typography>
          <Typography>Mã đơn hàng: {orderDetails.orderCode}</Typography>
          <Typography>Tổng tiền: ${orderDetails.totalAmount}</Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Sách đã đặt:
          </Typography>
          <Grid container spacing={2}>
            {orderDetails.books.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={book.img}
                    alt={book.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{book.name}</Typography>
                    <Typography>Số lượng: {book.quantity}</Typography>
                    <Typography>Giá: ${book.price}</Typography>
                    <Typography>
                      Tổng: ${book.quantity * book.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography>Không tìm thấy thông tin đơn hàng.</Typography>
      )}
    </Box>
  );
};

export default ThankYouPage;
