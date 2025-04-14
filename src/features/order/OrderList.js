import React from "react";
import { Grid, Typography } from "@mui/material";
import OrderCard from "./OrderCard";
import { useTranslation } from "react-i18next";

const OrderList = ({ purchaseHistory, expandedOrders, toggleExpand, handleOpenModal }) => {
  const { t } = useTranslation();

  if (purchaseHistory.length === 0) {
    return <Typography>{t("cart.noOrderHistory")}</Typography>;
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {purchaseHistory.map((order) => (
        <Grid item xs={12} sm={6} md={4} key={order._id}>
          <OrderCard
            order={order}
            expandedOrders={expandedOrders}
            toggleExpand={toggleExpand}
            handleOpenModal={handleOpenModal}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderList;