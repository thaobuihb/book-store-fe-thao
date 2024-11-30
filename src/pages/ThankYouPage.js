import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails } from "../features/order/orderSlice";

const ThankYouPage = () => {
  const location = useLocation();
  const { orderId } = location.state || {}; 
  const dispatch = useDispatch();
  const { orderDetails = null, isLoading = false, error = null } =
  useSelector((state) => state.orders || {});

  const [localOrder, setLocalOrder] = useState(null);

  useEffect(() => {
    console.log("Gửi request lấy thông tin đơn hàng với ID:", orderId);
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (!orderId && location.state?.orderData) {
      setLocalOrder(location.state.orderData);
    }
  }, [location.state]);

  const orderData = orderDetails || localOrder;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cảm ơn bạn đã đặt hàng tại Susu Anna Bookstore!
      </Typography>
      {isLoading ? (
        <Typography>Đang tải thông tin đơn hàng...</Typography>
      ) : error ? (
        <Typography color="error">Lỗi: {error}</Typography>
      ) : orderData ? (
        <>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Thông tin đơn hàng:</Typography>
            <Typography>Mã đơn hàng: {orderData?.orderCode || "N/A"}</Typography>
            <Typography>
              Ngày đặt hàng:{" "}
              {orderData?.createdAt
                ? new Date(orderData.createdAt).toLocaleString()
                : "N/A"}
            </Typography>
            <Typography>
              Tổng tiền: ${orderData?.totalAmount || "N/A"}
            </Typography>
            <Typography>
              Phương thức thanh toán: {orderData?.paymentMethods || "N/A"}
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Thông tin giao hàng:</Typography>
            <Typography>
              Họ tên: {orderData?.shippingAddress?.fullName || "N/A"}
            </Typography>
            <Typography>
              Số điện thoại: {orderData?.shippingAddress?.phone || "N/A"}
            </Typography>
            <Typography>
              Địa chỉ:{" "}
              {`${orderData?.shippingAddress?.addressLine || ""}, ${
                orderData?.shippingAddress?.city || ""
              }, ${orderData?.shippingAddress?.state || ""}, ${
                orderData?.shippingAddress?.country || ""
              }`}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography>Không tìm thấy thông tin đơn hàng.</Typography>
      )}
    </Box>
  );
};

export default ThankYouPage;
