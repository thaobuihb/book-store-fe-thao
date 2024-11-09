import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, fetchOrderDetails, createOrder, cancelOrder } from '../features/order/orderSlice';
import { Box, Typography, CircularProgress } from '@mui/material';
import OrderList from "../features/order/OrderList";
import OrderAction from "../features/order/OrderActions";
import OrderDetail from "../features/order/OrderDetails";

const OrderPage = ({ userId }) => {
  const dispatch = useDispatch();
  const { orders = [], orderDetails, isLoading, error } = useSelector((state) => state.orders || {});
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders(userId));
  }, [dispatch, userId]);

  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(fetchOrderDetails({ userId, orderId }));
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <OrderAction userId={userId} onCreateOrder={(orderData) => dispatch(createOrder(orderData))} />

      <OrderList orders={orders} onSelectOrder={handleSelectOrder} onCancelOrder={(orderId) => dispatch(cancelOrder({ userId, orderId }))} />

      {selectedOrderId && <OrderDetail orderDetails={orderDetails} />}
    </Box>
  );
};

export default OrderPage;
