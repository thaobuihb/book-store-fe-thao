import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const OrderItem = ({ item, t }) => {
  const price = item.discountedPrice || item.price;
  return (
    <Card sx={{ display: "flex", mb: 2 }}>
      <CardMedia
        component="img"
        image={item.img || "/default-book.jpg"}
        alt={item.name}
        sx={{ width: 100, height: 150 }}
      />
      <CardContent>
        <Typography>{item.name}</Typography>
        <Typography>{t("order.quantity")}: {item.quantity}</Typography>
        <Typography>{t("order.price")}: ${price}</Typography>
        <Typography>{t("order.totalForItem")}: ${item.quantity * price}</Typography>
      </CardContent>
    </Card>
  );
};

export default OrderItem;
