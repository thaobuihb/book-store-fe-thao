import React from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTranslation } from "react-i18next";

const BookDetailCard = ({
  book,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isInCart,
  isInWishlist,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!book) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        px: { xs: 2, md: 6 },
        py: 4,
      }}
    >
      {/* Hình ảnh & mô tả */}
      <Box sx={{ flex: 1 }}>
        <Box
          component="img"
          src={book.img}
          alt={book.name}
          sx={{
            width: "100%",
            maxHeight: 400,
            objectFit: "contain",
            mb: 2,
          }}
        />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {book.name}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {t("author")} {book.author}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            maxHeight: isMobile ? 120 : "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: isMobile ? 4 : "unset",
            WebkitBoxOrient: "vertical",
          }}
        >
          {t("description")}: {book.description}
        </Typography>
      </Box>

      {/* Thông tin chi tiết */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.5 },
          backgroundColor: "#B2EBF2",
          p: 3,
          borderRadius: 2,
          minWidth: { md: 250 },
        }}
      >
        <Stack spacing={1} sx={{ pl: 5 }}>
          <Typography variant="body1">
            <strong>{t("price")}:</strong> ${book.price}
          </Typography>
          <Typography variant="body1">
            <strong>{t("discount")}:</strong>{" "}
            {book.discountRate ? `${book.discountRate}%` : "0%"}
          </Typography>
          <Typography variant="body1">
            <strong>{t("discountedPrice")}:</strong> ${book.discountedPrice}
          </Typography>
          <Typography variant="body1">
            <strong>{t("publisher")}:</strong> {book.publisher}
          </Typography>
          <Typography variant="body1">
            <strong>{t("publicationDate")}:</strong> {book.publicationDate}
          </Typography>
          <Typography variant="body1">
            <strong>{t("isbn")}:</strong> {book.Isbn}
          </Typography>
          <Typography variant="body1">
            <strong>{t("category")}:</strong> {book.categoryName}
          </Typography>
        </Stack>

        {/* Số lượng + nút hành động */}
        <Stack spacing={2} alignItems="center" sx={{ mt: 10 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => onQuantityChange("dec")}>
              <RemoveIcon sx={{ color: "black" }} />
            </IconButton>
            <TextField
              value={quantity}
              sx={{ width: 60, "& input": { textAlign: "center" } }}
              inputProps={{ readOnly: true }}
            />
            <IconButton onClick={() => onQuantityChange("inc")}>
              <AddIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>

          <Box display="flex" justifyContent="center" gap={2}>
            <IconButton
              onClick={onAddToCart}
              sx={{ color: isInCart ? "orange" : "#0000FF" }}
            >
              <ShoppingCartOutlinedIcon />
            </IconButton>
            <IconButton onClick={onBuyNow} sx={{ color: "#0000FF" }}>
              <MonetizationOnIcon />
            </IconButton>
            <IconButton
              onClick={onToggleWishlist}
              sx={{ color: isInWishlist ? "secondary.main" : "#0000FF" }}
            >
              <FavoriteIcon />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default BookDetailCard;
