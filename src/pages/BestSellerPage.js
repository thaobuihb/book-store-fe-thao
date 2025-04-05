import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBestSellerBooks } from "../features/book/bookSlice";
import { Box, Typography, CircularProgress } from "@mui/material";
import BookItem from "../features/book/bookItem";
import { useTranslation } from "react-i18next";

const BestSellerPage = () => {
  const dispatch = useDispatch();
  const { bestSellerBooks, isLoading } = useSelector((state) => state.book);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getBestSellerBooks());
  }, [dispatch]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
      📚 {t('bestSellerTitle')}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : bestSellerBooks && bestSellerBooks.length > 0 ? (
        <BookItem books={bestSellerBooks} showTotalSold={true} />
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
          {t('noBestSellerBooks')}
        </Typography>
      )}
    </Box>
  );
};

export default BestSellerPage;
