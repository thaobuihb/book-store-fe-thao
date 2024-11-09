import React from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';

const OrderList = ({ orders, onSelectOrder, onCancelOrder }) => {
  return (
    <List>
      {orders.map((order) => (
        <ListItem key={order._id} divider>
          <ListItemText
            primary={`Order #${order._id}`}
            secondary={`Status: ${order.status} - Total: $${order.totalAmount}`}
          />
          <Button variant="outlined" onClick={() => onSelectOrder(order._id)} sx={{ mr: 1 }}>
            View Details
          </Button>
          <Button variant="contained" color="error" onClick={() => onCancelOrder(order._id)}>
            Cancel Order
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default OrderList;
