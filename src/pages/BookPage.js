import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooksByCategory } from "../features/book/bookSlice";
import BookItem from "../features/book/bookItem";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";

function BookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Lấy categoryId từ URL

  const categoryId = searchParams.get("category"); // Truy xuất categoryId từ query

  const { books, totalPages, currentPage } = useSelector((state) => state.book);

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  useEffect(() => {
    if (categoryId) {
      dispatch(getBooksByCategory(categoryId)); // Gọi API với categoryId
    }
  }, [dispatch, categoryId]);

  return (
    <Container>
      <BookItem
        title="Books by Category"
        books={books}
        handleBookClick={handleBookClick}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => dispatch(getBooksByCategory(categoryId, currentPage + 1))}
        handlePrevPage={() => dispatch(getBooksByCategory(categoryId, currentPage - 1))}
      />
    </Container>
  );
}

export default BookPage;
