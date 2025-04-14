import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const OrderSearch = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearSearch,
  searchResult,
  searchError,
  expandedOrders,
  toggleExpand,
  handleOpenModal,
  user,
}) => {
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

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <TextField
          label={t("orderSearchPlaceholder")}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          {t("search")}
        </Button>
        {searchResult?.orderCode && (
          <Button variant="outlined" color="secondary" onClick={handleClearSearch}>
            {t("clearSearch")}
          </Button>
        )}
      </Box>

      {searchError && <Typography color="error">{searchError}</Typography>}

      {searchResult?.orderCode && (
        <Card>
          <CardContent>
            <Typography>{t("orderCode")}: <strong>{searchResult.orderCode}</strong></Typography>
            <Typography>
              {t("status")}: <strong style={{ color: statusColors[searchResult.status] || "black" }}>{searchResult.status}</strong>
            </Typography>
            <Typography>
              {t("order.paymentStatus")}: <strong style={{ color: paymentStatusColors[searchResult.paymentStatus] || "black" }}>{searchResult.paymentStatus || t("order.noPaymentStatus")}</strong>
            </Typography>
            <Typography>{t("orderDate")}: {new Date(searchResult.createdAt).toLocaleDateString()}</Typography>
            <Typography>{t("total")}: ${searchResult.totalAmount?.toFixed(2)}</Typography>

            {Array.isArray(searchResult.books) && searchResult.books.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography>{t("cart.book")}:</Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <CardMedia
                    component="img"
                    image={searchResult.books[0].bookId?.img || "/default-book.jpg"}
                    alt={searchResult.books[0].bookId?.name || "Book"}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box>
                    <Typography>{searchResult.books[0]?.bookId?.name || t("noName")}</Typography>
                    <Typography>{t("order.price")}: ${searchResult.books[0]?.price?.toFixed(2)}</Typography>
                    <Typography>{t("order.quantity")}: {searchResult.books[0]?.quantity}</Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {searchResult.status === "Đang xử lý" && (
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => handleOpenModal(user?._id ? searchResult._id : searchResult.orderCode)}
              >
                {t("cancelOrder")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default OrderSearch;
