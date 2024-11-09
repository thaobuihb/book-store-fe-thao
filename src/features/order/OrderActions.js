import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField } from '@mui/material';

const OrderAction = ({ userId, onCreateOrder }) => {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    books: [],
    shippingAddress: '',
    paymentMethods: 'After receive',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateOrder = () => {
    onCreateOrder({ userId, ...orderData });
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Create New Order
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', width: 400, margin: 'auto', mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Create New Order
          </Typography>
          <TextField
            label="Shipping Address"
            fullWidth
            name="shippingAddress"
            value={orderData.shippingAddress}
            onChange={handleChange}
            sx={{ my: 2 }}
          />
          <TextField
            label="Payment Method"
            fullWidth
            name="paymentMethods"
            value={orderData.paymentMethods}
            onChange={handleChange}
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handleCreateOrder} fullWidth>
            Submit Order
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default OrderAction;
