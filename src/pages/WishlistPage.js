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
  toggleBookInWishlist,
} from "../features/wishlist/wishlistSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy danh sách chi tiết wishlist từ Redux store
  const { detailedWishlist, isLoading } = useSelector((state) => state.wishlist);

  // Dùng useEffect để gọi loadWishlist khi component được render
  useEffect(() => {
    // Gọi action để lấy dữ liệu wishlist từ localStorage hoặc server
    dispatch(loadWishlist());
  }, [dispatch]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (bookId) => {
    navigate("/cart"); // Điều hướng sang trang giỏ hàng
  };

  // Hàm xử lý xóa sách khỏi wishlist
  const handleRemoveFromWishlist = (bookId) => {
    dispatch(toggleBookInWishlist(bookId)); // Gọi action để xóa sách khỏi wishlist
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
        Your Wishlist
      </Typography>

      {/* Hiển thị thông báo khi đang tải dữ liệu */}
      {isLoading ? (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center" }}>
          Loading your wishlist...
        </Typography>
      ) : detailedWishlist.length === 0 ? (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ textAlign: "center" }}
        >
          No books in your wishlist.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {detailedWishlist.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book._id}>
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
                {/* Nút xóa */}
                <IconButton
                  onClick={() => handleRemoveFromWishlist(book._id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "red",
                    zIndex: 1,
                    visibility: "visible",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>

                {/* Ảnh bìa sách */}
                <CardMedia
                  component="img"
                  image={book.img}
                  alt={book.name}
                  sx={{
                    height: 250,
                    objectFit: "cover",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                />

                {/* Nội dung chi tiết */}
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {book.name}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "gray" }}>
                    Author: {book.author}
                  </Typography>

                  {/* Giá sách */}
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
                      <span style={{ fontWeight: "bold" }}>${book.price}</span>
                    )}
                  </Typography>

                  {/* Nút Thêm vào giỏ hàng */}
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
                    onClick={() => handleAddToCart(book._id)}
                  >
                    ADD TO CART
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Hàng các liên kết chia sẻ */}
      <Box sx={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>
          Share your wishlist:
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
    </Box>
  );
};

export default WishlistPage;
