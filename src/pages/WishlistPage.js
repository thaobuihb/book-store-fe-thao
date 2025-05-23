import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  loadWishlist,
  removeBookFromWishlist,
  clearAllWishlistItems,
} from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useTranslation } from "react-i18next";

const WishlistPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detailedWishlist, isLoading } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  const handleAddToCart = (book) => {
    dispatch(
      addToCart({
        bookId: book._id,
        name: book.name,
        price: book.price,
        discountedPrice: book.discountedPrice,
        img: book.img,
      })
    );
  };

  const handleRemoveFromWishlist = (bookId) => {
    dispatch(removeBookFromWishlist(bookId));
  };

  const handleClearWishlist = () => {
    dispatch(clearAllWishlistItems());
  };

  const handleNavigateToDetail = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
        {t("wishlist.title")}
      </Typography>

      {isLoading ? (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ textAlign: "center" }}
        >
          {t("wishlist.loading")}
        </Typography>
      ) : detailedWishlist.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {t("wishlist.empty")}{" "}
          </Typography>

          {/* Nút Xem Tiếp */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate("/")}
          >
            {t("wishlist.exploreMore")}{" "}
          </Button>
        </Box>
      ) : (
        <>
          {/* Danh sách sách */}
          <Grid container spacing={3} justifyContent="center">
            {detailedWishlist.map((book, index) => (
              <Grid item xs={12} sm={6} md={3} key={book._id || index}>
                <Card
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 400,
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <IconButton
                    onClick={() => handleRemoveFromWishlist(book._id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "red",
                      zIndex: 1,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <CardMedia
                    component="img"
                    image={book.img || "/default-book.jpg"}
                    alt={book.name}
                    sx={{
                      height: 250,
                      objectFit: "cover",
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => handleNavigateToDetail(book._id)}
                  />

                  <CardContent
                    sx={{
                      textAlign: "center",
                      p: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => handleNavigateToDetail(book._id)}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {book.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: "gray" }}>
                      {t("wishlist.author")}: {book.author}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {book.discountedPrice ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "gray",
                            }}
                          >
                            ${book.price}
                          </span>{" "}
                          <span style={{ fontWeight: "bold", color: "green" }}>
                            ${book.discountedPrice}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontWeight: "bold" }}>
                          ${book.price}
                        </span>
                      )}
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        marginTop: 2,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        fontWeight: "bold",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(book);
                      }}
                    >
                      {t("wishlist.addToCart")}{" "}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Ẩn phần này nếu wishlist trống */}
          {detailedWishlist.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 2,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textAlign: "center",
                }}
                onClick={handleClearWishlist}
              >
                {t("wishlist.clearAll")}{" "}
              </Typography>

              <Box
                sx={{ marginTop: 6, display: "flex", justifyContent: "center" }}
              >
                <Typography variant="h6" sx={{ marginRight: 2 }}>
                  {t("wishlist.shareList")}
                </Typography>
                <IconButton
                  component="a"
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon sx={{ color: "#4267B2", fontSize: 30 }} />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon sx={{ color: "#E1306C", fontSize: 30 }} />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon sx={{ color: "#1DA1F2", fontSize: 30 }} />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon sx={{ color: "#0077B5", fontSize: 30 }} />
                </IconButton>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};
export default WishlistPage;
