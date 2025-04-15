import React from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
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

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", m: 10 }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <Box
          component="img"
          src={book?.img}
          alt={book?.name}
          sx={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
        />
        <Box component="a" sx={{ mt: 2 }}>
          <Typography variant="h5">{book?.name}</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {t("author")} {book?.author}
          </Typography>
          <Typography sx={{ fontSize: "1.1rem" }} variant="body2">
            {t("description")}: {book?.description}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          background: "#B2EBF2",
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 1,
        }}
      >
        <Box sx={{ m: 3 }}>
          <Typography sx={{ m: 2 }} variant="h6">
            {t("price")}: ${book?.price}
          </Typography>
          <Typography sx={{ m: 2 }} variant="h6">
            {t("discount")}: {book?.discountRate ? `${book.discountRate} %` : "0%"}
          </Typography>
          <Typography sx={{ m: 2 }} variant="h6">
            {t("discountedPrice")}: ${book?.discountedPrice}
          </Typography>
          <Typography sx={{ m: 2 }} variant="h6">
            {t("publisher")}: {book?.publisher}
          </Typography>
          <Typography sx={{ m: 2 }} variant="h6">
            {t("publicationDate")}: {book?.publicationDate}
          </Typography>
          <Typography sx={{ m: 2 }} variant="h6">
            {t("isbn")}: {book?.Isbn}
          </Typography>
          <Typography sx={{ m: 2 }} variant="h6">
            {t("category")}: {book?.categoryName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            m: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <IconButton sx={{ color: "black" }} onClick={() => onQuantityChange("dec")}>
              <RemoveIcon />
            </IconButton>
            <TextField
              value={quantity}
              sx={{ width: "50px", "& input": { textAlign: "center" } }}
              inputProps={{ readOnly: true }}
            />
            <IconButton sx={{ color: "black" }} onClick={() => onQuantityChange("inc")}>
              <AddIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <IconButton onClick={onAddToCart} sx={{ color: isInCart ? "orange" : "#0000FF" }}>
              <ShoppingCartOutlinedIcon />
            </IconButton>
            <IconButton onClick={onBuyNow} sx={{ color: "#0000FF" }}>
              <MonetizationOnIcon />
            </IconButton>
            <IconButton onClick={onToggleWishlist} sx={{ color: isInWishlist ? "secondary.main" : "#0000FF" }}>
              <FavoriteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetailCard;
