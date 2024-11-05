import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../features/book/bookSlice";
import { getCategories } from "../features/category/categorySlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";
import BookItem from "../features/book/bookItem";

function BookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { books, totalPages, currentPage } = useSelector((state) => state.book);
  const categories = useSelector((state) => state.category.categories);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    // Gọi danh mục nếu chưa có trong Redux store
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const fetchBooks = () => {
      if (search) {
        dispatch(getBooks(page, search, "", "", ""));
      } else if (category) {
        dispatch(getBooks(page, "", "", "", category));

        const selectedCategory = categories.find((cat) => cat._id === category);
        setCategoryName(selectedCategory ? selectedCategory.categoryName : "Unknown Category");
      }
    };
    fetchBooks();
  }, [dispatch, page, search, category, categories]);

  return (
    <Container>
      {search ? (
        <BookItem
          title={`Search results for "${search}"`}
          books={books}
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={() => navigate(`?page=${page + 1}&search=${search}`)}
          handlePrevPage={() => navigate(`?page=${page - 1}&search=${search}`)}
        />
      ) : (
        <BookItem
          title={`Books in ${categoryName}`}
          books={books}
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={() => navigate(`?page=${page + 1}&category=${category}`)}
          handlePrevPage={() => navigate(`?page=${page - 1}&category=${category}`)}
        />
      )}
    </Container>
  );
}

export default BookPage;
