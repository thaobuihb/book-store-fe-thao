import React from "react";
import { Typography, Box } from "@mui/material";
import PaginationControls from "../../components/PaginationControls";
import BookItem from "./bookItem";

const BookSection = ({ title, category, books, getCurrentBooks, currentPage, totalPages, onPageChange, sx }) => {
  return (
    <>
      <Typography component="h4" gutterBottom sx={{ fontSize: "22px", fontWeight: "bold", mt: 3 }} align="left">
        {title}
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center" sx={sx}>
        <PaginationControls
          category={category}
          position="left"
          onPageChange={onPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
        />
        <Box sx={{ flex: "1", mx: 2 }}>
          <BookItem books={getCurrentBooks(books, category)} />
        </Box>
        <PaginationControls
          category={category}
          position="right"
          onPageChange={onPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Box>
    </>
  );
};

export default BookSection;
