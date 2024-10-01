import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../features/book/bookSlice";
import BookItem from "../features/book/bookItem";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";

function BookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 

  const { books, totalPages, currentPage } = useSelector((state) => state.book);
  const allBooks = books.flat();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  return (
    <Container>
      <BookItem
        title="Anna & Susu Books"
        books={books}
        handleBookClick={handleBookClick}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => dispatch(getBooks(currentPage + 1))}
        handlePrevPage={() => dispatch(getBooks(currentPage - 1))}
      />
    </Container>
  );
}

export default BookPage;
