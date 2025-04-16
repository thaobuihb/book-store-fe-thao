import React from "react";
import { Box, Typography } from "@mui/material";

const OrderSummary = ({ subtotal, shippingFee, total, t }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t("order.paymentDetails")}
      </Typography>
      <Box sx={{ mt: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <Typography>
          <strong>{t("order.subtotal")}:</strong> ${subtotal.toFixed(2)}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>{t("order.shippingFee")}:</strong> ${shippingFee.toFixed(2)}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          <strong>{t("order.total")}:</strong> ${total.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderSummary;
