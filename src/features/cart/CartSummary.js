import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const CartSummary = ({
  totalPrice,
  selectedItems,
  handleClearCart,
  handleProceedToCheckout,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        padding: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        textAlign: "center",
        mt: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
      {t("total")}: ${totalPrice}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2, width: "15%" }}
        onClick={handleProceedToCheckout}
        disabled={selectedItems.length === 0}
      >
        {t("checkout")}
      </Button>
      <Typography
        variant="body2"
        sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
        onClick={handleClearCart}
      >
        {t("clearCart")}
      </Typography>
    </Box>
  );
};

export default CartSummary;
