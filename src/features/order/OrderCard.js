import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const OrderCard = ({ order, expandedOrders, toggleExpand, handleOpenModal }) => {
  const { t } = useTranslation();

  const statusColors = {
    "Đang xử lý": "orange",
    "Đã giao hàng": "blue",
    "Đã nhận hàng": "green",
    "Trả hàng": "red",
    "Đã hủy": "red",
  };

  const paymentStatusColors = {
    "Đã thanh toán": "green",
    "Đã hoàn tiền": "orange",
    "Chưa thanh toán": "purple",
  };

  const firstBook = order.books?.[0];

  return (
    <Card>
      <CardContent>
        <Typography>{t("orderCode")}: <strong>{order.orderCode}</strong></Typography>
        <Typography>
          {t("status")}: <strong style={{ color: statusColors[order.status] || "black" }}>{order.status}</strong>
        </Typography>
        <Typography>
          {t("order.paymentStatus")}: <strong style={{ color: paymentStatusColors[order.paymentStatus] || "black" }}>{order.paymentStatus || t("order.noPaymentStatus")}</strong>
        </Typography>
        <Typography>{t("orderDate")}: {new Date(order.createdAt).toLocaleDateString()}</Typography>
        <Typography>{t("total")}: ${order.totalAmount?.toFixed(2)}</Typography>

        <Typography sx={{ mt: 2 }}><strong>{t("address")}:</strong></Typography>
        <Typography>{order.shippingAddress.fullName}</Typography>
        <Typography>{order.shippingAddress.phone}</Typography>
        <Typography>
          {order.shippingAddress.addressLine}, {order.shippingAddress.city},
          {order.shippingAddress.state}, {order.shippingAddress.zipcode},
          {order.shippingAddress.country}
        </Typography>

        {firstBook && (
          <>
            <Typography sx={{ mt: 2 }}>{t("cart.book")}:</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <CardMedia
                component="img"
                image={firstBook.bookId?.img || "/default-book.jpg"}
                alt={firstBook.bookId?.name || "Book"}
                sx={{ width: 50, height: 50, mr: 2 }}
              />
              <Box>
                <Typography>{firstBook.bookId?.name}</Typography>
                <Typography>{t("price")}: ${firstBook.price ? firstBook.price.toFixed(2) : "0.00"}</Typography>
                <Typography>{t("order.quantity")}: {firstBook.quantity}</Typography>
              </Box>
            </Box>
          </>
        )}

        {order.books?.length > 1 && (
          <Button
            variant="text"
            size="small"
            sx={{ mt: 1, textTransform: "none" }}
            onClick={() => toggleExpand(order._id)}
          >
            {expandedOrders[order._id] ? t("cart.showLess") : t("cart.showMore")}
          </Button>
        )}

        {expandedOrders[order._id] && order.books.slice(1).map((book, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", mt: 1, pl: 2 }}>
            <CardMedia
              component="img"
              image={book.bookId?.img || "/default-book.jpg"}
              alt={book.bookId?.name}
              sx={{ width: 50, height: 50, mr: 2 }}
            />
            <Box>
              <Typography>{book.bookId?.name}</Typography>
              <Typography>{t("price")}: ${book.price ? book.price.toFixed(2) : "0.00"}</Typography>
              <Typography>{t("order.quantity")}: {book.quantity}</Typography>
            </Box>
          </Box>
        ))}

        {order.status === "Đang xử lý" && (
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => handleOpenModal(order._id || order.orderCode)}
          >
            {t("cancelOrder")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
