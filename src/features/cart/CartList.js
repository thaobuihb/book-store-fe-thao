import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const CartList = ({ cartItems, selectedItems, handleCheckboxChange, handleUpdateQuantity, handleRemoveItem }) => {
  const { t } = useTranslation();

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="textSecondary">
          {t("emptyCart")}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {cartItems.map((item, index) => (
        <Grid item xs={12} key={`${item.bookId}-${index}`}>
          <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
            <Checkbox
              checked={selectedItems.includes(item.bookId)}
              onChange={() => handleCheckboxChange(item.bookId)}
            />
            <CardMedia
              component="img"
              image={item.img || "/default-book.jpg"}
              alt={item.name}
              sx={{ width: 100, height: 150 }}
            />
            <Box sx={{ flex: 1, marginLeft: 2 }}>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1">
                  {t("price")}: ${item.discountedPrice || item.price}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                  <IconButton
                    onClick={() => handleUpdateQuantity(item.bookId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography variant="body1" sx={{ px: 2 }}>{item.quantity}</Typography>
                  <IconButton
                    onClick={() => handleUpdateQuantity(item.bookId, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                {t("total")}: ${Number((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
                </Typography>
              </CardContent>
            </Box>
            <IconButton
              sx={{ color: "#FF0000" }}
              onClick={() => handleRemoveItem(item.bookId)}
            >
              <Delete />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CartList;
