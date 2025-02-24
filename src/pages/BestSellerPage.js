import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBestSellerBooks } from "../features/book/bookSlice";
import { Box, Typography, CircularProgress } from "@mui/material";
import BookItem from "../features/book/bookItem";

const BestSellerPage = () => {
  const dispatch = useDispatch();
  const { bestSellerBooks, isLoading } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(getBestSellerBooks());
  }, [dispatch]);

  console.log("Redux Best Seller Books:", bestSellerBooks); 
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        📚 Best Seller Books
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : bestSellerBooks && bestSellerBooks.length > 0 ? (
        <BookItem  books={bestSellerBooks} showTotalSold={true} />
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
          Không có sách bán chạy nào.
        </Typography>
      )}
    </Box>
  );
};

export default BestSellerPage;
