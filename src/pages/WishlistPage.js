import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Typography, IconButton, Card, CardMedia, CardContent, Button } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DeleteIcon from '@mui/icons-material/Delete'; // Thêm biểu tượng xóa
import { useNavigate } from "react-router-dom";
import { toggleBookInWishlist } from "../features/wishlist/wishlistSlice"; // Thêm action để xóa khỏi wishlist

const WishlistPage = () => {
  // Lấy danh sách wishlist từ Redux store
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hàm xử lý thêm vào giỏ hàng và điều hướng
  const handleAddToCart = (bookId) => {
    // Logic thêm vào giỏ hàng
    navigate("/cart"); // Điều hướng đến trang giỏ hàng
  };

  // Hàm xử lý xóa sách khỏi wishlist
  const handleRemoveFromWishlist = (bookId) => {
    dispatch(toggleBookInWishlist(bookId)); // Xóa sách khỏi wishlist
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Wishlist
      </Typography>

      {/* Nếu không có sách trong wishlist */}
      {wishlist.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No books in your wishlist.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Hiển thị danh sách sách yêu thích */}
          {wishlist.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 350 }}>
                {/* Biểu tượng xóa ở góc trên bên phải */}
                <IconButton 
                  onClick={() => handleRemoveFromWishlist(book._id)} 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8,
                    color: 'red' // Màu đỏ để người dùng dễ nhận diện
                  }}>
                  <DeleteIcon />
                </IconButton>

                <CardMedia
                  component="img"
                  image={book.img}
                  alt={book.name}
                  sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6">{book.name}</Typography>
                  <Typography variant="subtitle1">by {book.author}</Typography>
                  <Typography variant="body2">
                    {book.discountedPrice ? (
                      <>
                        <span style={{ textDecoration: 'line-through' }}>${book.price}</span>{' '}
                        <span>${book.discountedPrice}</span>
                      </>
                    ) : (
                      `$${book.price}`
                    )}
                  </Typography>
                  {/* Nút ADD TO CART */}
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginTop: 2 }}
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
      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>
          Share your wishlist:
        </Typography>
        <IconButton component="a" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FacebookIcon sx={{ color: "#4267B2" }} />
        </IconButton>
        <IconButton component="a" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <InstagramIcon sx={{ color: "#E1306C" }} />
        </IconButton>
        <IconButton component="a" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <TwitterIcon sx={{ color: "#1DA1F2" }} />
        </IconButton>
        <IconButton component="a" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon sx={{ color: "#0077B5" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default WishlistPage;
