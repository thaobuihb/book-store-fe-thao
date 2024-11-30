import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const ThankYouPage = () => {
  const location = useLocation();
  const { message, orderData } = location.state || {};

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cảm ơn bạn đã đặt hàng tại Susu Anna Bookstore!
      </Typography>
      <Typography variant="h6">{message}</Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Thông tin đơn hàng:</Typography>
        <Typography>Mã đơn hàng: {orderData?.orderCode || "N/A"}</Typography>
        <Typography>Ngày đặt hàng: {new Date(orderData?.createdAt).toLocaleString() || "N/A"}</Typography>
        <Typography>
          Tổng tiền: ${orderData?.totalAmount || "N/A"}
        </Typography>
        <Typography>Phương thức thanh toán: {orderData?.paymentMethod || "N/A"}</Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Thông tin giao hàng:</Typography>
        <Typography>Họ tên: {orderData?.shippingAddress?.fullName || "N/A"}</Typography>
        <Typography>Số điện thoại: {orderData?.shippingAddress?.phone || "N/A"}</Typography>
        <Typography>Địa chỉ: {`${orderData?.shippingAddress?.street || ""}, ${orderData?.shippingAddress?.ward || ""}, ${orderData?.shippingAddress?.district || ""}, ${orderData?.shippingAddress?.city || ""}, ${orderData?.shippingAddress?.country || ""}`}</Typography>
      </Box>
    </Box>
  );
};

export default ThankYouPage;
