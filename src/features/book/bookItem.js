import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Box,
  CardContent,
  Tooltip,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toggleBookInWishlist } from "../wishlist/wishlistSlice";
import { addToCart } from "../cart/cartSlice";

const BookItem = ({ title, books }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const cart = useSelector((state) => state.cart.cart);

  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAddToWishlist = (bookId) => {
    dispatch(toggleBookInWishlist(bookId));
  };

  const handleAddToCart = (book) => {
    dispatch(
      addToCart({
        bookId: book._id,
        name: book.title,
        price: book.price,
        discountedPrice: book.discountedPrice,
        img: book.img,
      })
    );
  };

  return (
    <section>
      <Typography
        component="h4"
        gutterBottom
        sx={{ fontSize: "25px", fontWeight: "bold", textAlign: "center" }}
      >
        {title}
      </Typography>
      <Grid container spacing={0.5} justifyContent="center">
        {books.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No books available.
          </Typography>
        ) : (
          books.map((book) => (
            <Grid
            item xs={6} sm={4} md={3} lg={1.7} xl={1.5}
              key={book._id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  width: "160px",
                  height: "380px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  boxShadow: 3,
                }}
              >
                {/* Ảnh bìa sách */}
                <Box
                  sx={{
                    width: "140px",
                    height: "180px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt={book.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleBookClick(book._id)}
                  />
                </Box>
                <CardContent
                  sx={{ textAlign: "center", width: "100%", minHeight: "80px" }}
                >
                  {/* Tiêu đề sách */}
                  <Tooltip
                    title={
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#fff",
                          padding: "5px",
                        }}
                      >
                        {book.name}
                      </Typography>
                    }
                    arrow
                    placement="top"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxHeight: "40px",
                        whiteSpace: "normal",
                      }}
                    >
                      {book.name}
                    </Typography>
                  </Tooltip>
                  <Box
                    sx={{
                      mt: 1,
                      minHeight: "50px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {book.discountedPrice &&
                    book.discountedPrice < book.price ? (
                      <>
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: "line-through", color: "gray" }}
                        >
                          {`$${book.price}`}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "green" }}
                        >
                          {`$${book.discountedPrice}`}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {`$${book.price}`}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                {/* Icon giỏ hàng và wishlist - Đặt trong Box để cố định vị trí */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    width: "100%",
                    paddingBottom: "10px",
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => handleAddToCart(book)}
                  >
                    <AddShoppingCartIcon
                      sx={{
                        color: cart.some((item) => item.bookId === book._id)
                          ? "secondary.main"
                          : "#0000FF",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleAddToWishlist(book._id)}
                  >
                    <FavoriteIcon
                      sx={{
                        color: wishlist.includes(book._id)
                          ? "secondary.main"
                          : "#0000FF",
                      }}
                    />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </section>
  );
};

export default BookItem;
