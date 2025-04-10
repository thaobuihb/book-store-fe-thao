import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookWithCategory } from "../features/book/bookSlice";
import { toggleBookInWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { Box, Typography, Button, IconButton, TextField } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import BookItem from "../features/book/bookItem";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTranslation } from "react-i18next";


const DetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { book, isLoading, booksByCategory } = useSelector(
    (state) => state.book
  );

  const cart = useSelector((state) => state.cart.cart);

  const { wishlist } = useSelector((state) => state.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [isBookInCart, setIsBookInCart] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    dispatch(getBookWithCategory(bookId));
  }, [dispatch, bookId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [booksByCategory]);
  

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToWishlist = () => {
    dispatch(toggleBookInWishlist(bookId));
  };

  const isBookInWishlist = wishlist.includes(bookId);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        bookId: book._id,
        name: book.name,
        price: book.price,
        discountedPrice: book.discountedPrice,
        img: book.img,
        quantity: quantity,
      })
    );
    setIsBookInCart(true);
  };

  const handleBuyNow = (useId) => {
    const isBookInCart = cart.some((item) => item.bookId === book._id);

    if (!isBookInCart) {
      dispatch(
        addToCart({
          bookId: book._id,
          name: book.name,
          price: book.price,
          discountedPrice: book.discountedPrice,
          img: book.img,
          quantity: quantity,
        })
      );
    }

    const orderDetails = {
      items: [
        {
          img: book.img,
          _id: book._id,
          bookId: book._id,
          name: book.name,
          price: book.discountedPrice || book.price,
          quantity: quantity,
          total: parseFloat((book.discountedPrice || book.price) * quantity),
        },
      ],
      totalAmount: parseFloat((book.discountedPrice || book.price) * quantity),
    };

    // localStorage.setItem("buyNowOrder", JSON.stringify(orderDetails));
    sessionStorage.setItem("buyNowOrder", JSON.stringify(orderDetails));


    navigate(`/order/${useId}`, { state: orderDetails });
  };

  return (
    <Box sx={{ padding: 4 }}>
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
            {t('author')} {book?.author}
            </Typography>
            <Typography sx={{ fontSize: "1.1rem" }} variant="body2">
            {t('description')}: {book?.description}
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
            {t('price')}: ${book?.price}
            </Typography>
            <Typography sx={{ m: 2 }} variant="h6">
            {t('discount')}: {book?.discountRate ? `${book.discountRate} %` : "0%"}
            </Typography>
            <Typography sx={{ m: 2 }} variant="h6">
            {t('discountedPrice')}: ${book?.discountedPrice}
            </Typography>
            <Typography sx={{ m: 2 }} variant="h6">
            {t('publisher')}: {book?.publisher}
            </Typography>
            <Typography sx={{ m: 2 }} variant="h6">
            {t('publicationDate')}: {book?.publicationDate}
            </Typography>
            <Typography sx={{ m: 2 }} variant="h6">
            {t('isbn')}: {book?.Isbn}
            </Typography>
            <Typography sx={{ m: 2 }} variant="h6">
            {t('category')}: {book?.categoryName}
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
            {/* Bộ tăng giảm số lượng */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <IconButton sx={{ color: "black" }} onClick={handleDecrease}>
                <RemoveIcon />
              </IconButton>
              <TextField
                value={quantity}
                sx={{
                  width: "50px",
                  "& input": { textAlign: "center" }, 
                }}
                inputProps={{ readOnly: true }}
              />

              <IconButton sx={{ color: "black" }} onClick={handleIncrease}>
                <AddIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <IconButton
                onClick={handleAddToCart}
                sx={{
                  color: isBookInCart ? "orange" : "#0000FF",
                }}
              >
                <ShoppingCartOutlinedIcon />
              </IconButton>

              <IconButton
                onClick={handleBuyNow}
                sx={{
                  color: "#0000FF",
                }}
              >
                <MonetizationOnIcon />
              </IconButton>

              <IconButton
                color="primary"
                onClick={handleAddToWishlist}
                sx={{
                  color: isBookInWishlist ? "secondary.main" : "#0000FF",
                }}
              >
                <FavoriteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mt: 5, mb: 2, fontWeight: "bold" }}>
        {t('relatedBooks')}
        </Typography>
        <BookItem books={booksByCategory} />
      </Box>
    </Box>
  );
};

export default DetailPage;
