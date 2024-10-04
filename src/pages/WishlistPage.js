import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Typography, IconButton, Card, CardMedia, CardContent, Button } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { toggleBookInWishlist, loadWishlist } from "../features/wishlist/wishlistSlice"; 

const WishlistPage = () => {
  
  const { detailedWishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    dispatch(loadWishlist()); 
  }, [dispatch]);

  
  const handleAddToCart = (bookId) => {
    navigate("/cart"); 
  };

  
  const handleRemoveFromWishlist = (bookId) => {
    dispatch(toggleBookInWishlist(bookId)); 
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your wishlist
      </Typography>

      {detailedWishlist.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No books in yours wishlist.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {detailedWishlist.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book._id}>
              <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 350 }}>
                {/* Nút xóa */}
                <IconButton onClick={() => handleRemoveFromWishlist(book._id)} sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }}>
                  <DeleteIcon />
                </IconButton>

                {/* Ảnh bìa sách */}
                <CardMedia component="img" image={book.img} alt={book.name} sx={{ height: 200, objectFit: "cover" }} />

                {/* Nội dung chi tiết */}
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{book.name}</Typography>
                  <Typography variant="subtitle1">Author: {book.author}</Typography>

                  {/* Giá sách */}
                  <Typography variant="body2">
                    {book.discountedPrice ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'gray' }}>${book.price}</span>{' '}
                        <span style={{ fontWeight: 'bold', color: 'green' }}>${book.discountedPrice}</span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 'bold' }}>${book.price}</span>
                    )}
                  </Typography>

                  {/* Nút Thêm vào giỏ hàng */}
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginTop: 2, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
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
