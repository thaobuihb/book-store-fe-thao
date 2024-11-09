import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const OrderDetail = ({ orderDetails, onClose }) => {
  if (!orderDetails) return null;

  return (
    <Dialog open={Boolean(orderDetails)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Order ID: {orderDetails._id}</Typography>
        <Typography variant="body1">Status: {orderDetails.status}</Typography>
        <Typography variant="body1">Total Amount: ${orderDetails.totalAmount}</Typography>
        <Typography variant="body1" gutterBottom>
          Shipping Address: {orderDetails.shippingAddress}
        </Typography>

        <Typography variant="h6">Books in Order:</Typography>
        <List>
          {orderDetails.books.map((book) => (
            <ListItem key={book.bookId} divider>
              <ListItemText
                primary={book.name}
                secondary={`Quantity: ${book.quantity} - Price: $${book.price}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetail;
