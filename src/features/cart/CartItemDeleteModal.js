import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

const CartItemDeleteModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          className="modal-container"
          sx={{
            width: "80%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 0,
          }}
        >
          <Typography variant="h6">Confirm Deletion</Typography>
          <Typography variant="body1">
            Are you sure you want to delete this item from your cart?
          </Typography>
          <Box
            className="modal-buttons"
            sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={onConfirm}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CartItemDeleteModal;
