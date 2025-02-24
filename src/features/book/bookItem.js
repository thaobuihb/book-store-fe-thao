import React, { useState, useEffect } from "react";
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
import { useSpring, animated } from "@react-spring/web";
import FlyingIcon from "./FlyingIcon";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookInWishlist } from "../wishlist/wishlistSlice";
import { addToCart } from "../cart/cartSlice";

const BookItem = ({ title, books, showTotalSold = false }) => {
  // console.log("BookItem nhận dữ liệu:", books);
  const dispatch = useDispatch();

  const { wishlist } = useSelector((state) => state.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();

  const [flyingIcons, setFlyingIcons] = useState([]);

  
  const handleFlyIcon = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const target = document.getElementById("cart-icon");

    if (!target) {
      console.warn("Cart icon not found!");
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const newIcon = {
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      targetX: targetRect.left + targetRect.width / 2,
      targetY: targetRect.top + targetRect.height / 2,
    };

    setFlyingIcons((prevIcons) => [...prevIcons, newIcon]);

    console.log("Added new flying icon:", newIcon);
  console.log("Updated flyingIcons:", [...flyingIcons, newIcon]);
  };

  const removeFlyingIcon = (id) => {
    setFlyingIcons((prevIcons) => prevIcons.filter((icon) => icon.id !== id));
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAddToCart = (event, book) => {
    handleFlyIcon(event);

    setTimeout(() => {
      dispatch(addToCart(book));
    }, 500);
  };

  const handleAddToWishlist = (bookId) => {
    if (typeof bookId !== "string") {
      console.error("Invalid bookId:", bookId);
      return;
    }
    dispatch(toggleBookInWishlist(bookId));
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
        {!books || books.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No books available.
          </Typography>
        ) : (
          books.map((book) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={1.7}
              xl={1.5}
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
                      onClick={() => handleBookClick(book._id)}
                    >
                      {book.name}
                    </Typography>
                  </Tooltip>
                  {/* 🛒 Nếu là Best Seller Page, hiển thị số sách đã bán */}
                  {showTotalSold && book.totalSold !== undefined && (
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "gray", mt: 1 }}>
                      🔥 Đã bán: {book.totalSold} cuốn
                    </Typography>
                  )}
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
                    onClick={(e) => handleAddToCart(e, book)}
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
                    onClick={(e) => handleAddToWishlist(book._id)}
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
      {flyingIcons.map((icon) => (
        <FlyingIcon key={icon.id} icon={icon} onAnimationEnd={removeFlyingIcon} />
      ))}
    </section>
  );
};

export default BookItem;
