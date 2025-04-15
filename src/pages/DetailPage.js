// DetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookWithCategory } from "../features/book/bookSlice";
import { toggleBookInWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { Box, Typography } from "@mui/material";
import BookDetailCard from "../features/book/BookDetailCard";
import BookItem from "../features/book/bookItem";
import { useTranslation } from "react-i18next";

const DetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { book, booksByCategory } = useSelector((state) => state.book);
  const { wishlist } = useSelector((state) => state.wishlist);
  const cart = useSelector((state) => state.cart.cart);

  const [quantity, setQuantity] = useState(1);
  const [isBookInCart, setIsBookInCart] = useState(false);

  useEffect(() => {
    dispatch(getBookWithCategory(bookId));
  }, [dispatch, bookId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [booksByCategory]);

  const isBookInWishlist = wishlist.includes(bookId);

  const updateCart = () => {
    dispatch(
      addToCart({
        bookId: book._id,
        name: book.name,
        price: book.price,
        discountedPrice: book.discountedPrice,
        img: book.img,
        quantity,
      })
    );
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToWishlist = () => dispatch(toggleBookInWishlist(bookId));

  const handleAddToCart = () => {
    updateCart();
    setIsBookInCart(true);
  };

  const handleBuyNow = () => {
    const alreadyInCart = cart.some((item) => item.bookId === book._id);
    if (!alreadyInCart) updateCart();

    const price = book.discountedPrice || book.price;
    const orderDetails = {
      items: [
        {
          img: book.img,
          _id: book._id,
          bookId: book._id,
          name: book.name,
          price,
          quantity,
          total: parseFloat(price * quantity),
        },
      ],
      totalAmount: parseFloat(price * quantity),
    };

    sessionStorage.setItem("buyNowOrder", JSON.stringify(orderDetails));
    navigate(`/order/${book._id}`, { state: orderDetails });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <BookDetailCard
        book={book}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleAddToWishlist}
        isInCart={isBookInCart}
        isInWishlist={isBookInWishlist}
      />

      <Box>
        <Typography variant="h6" sx={{ mt: 5, mb: 2, fontWeight: "bold" }}>
          {t("relatedBooks")}
        </Typography>
        <BookItem books={booksByCategory} />
      </Box>
    </Box>
  );
};

export default DetailPage;
