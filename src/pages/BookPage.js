import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../features/book/bookSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";
import BookItem from "../features/book/bookItem";

function BookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { books, totalPages, currentPage } = useSelector((state) => state.book);

  // Lấy các tham số từ URL, nếu không có thì gán mặc định là chuỗi rỗng
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    // Gọi API với các tham số hiện có
    dispatch(getBooks(page, search, "", "", category));
    console.log("Fetching books for category:", category);
  }, [dispatch, page, search, category]);

  return (
    <Container>
      <BookItem
        title="Anna & Susu Books"
        books={books}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => navigate(`?page=${page + 1}&category=${category}&search=${search}`)}
        handlePrevPage={() => navigate(`?page=${page - 1}&category=${category}&search=${search}`)}
      />
    </Container>
  );
}

export default BookPage;
