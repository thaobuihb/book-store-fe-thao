import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../features/book/bookSlice";
import { getCategories } from "../features/category/categorySlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";
import BookItem from "../features/book/bookItem";
import { useTranslation } from "react-i18next";

function BookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const { books, totalPages, currentPage } = useSelector((state) => state.book);
  const categories = useSelector((state) => state.category.categories);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
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
        setCategoryName(
          selectedCategory ? selectedCategory.categoryName : "Unknown Category"
        );
      }
    };
    fetchBooks();
  }, [dispatch, page, search, category, categories]);

  return (
    <Container>
      {search ? (
        <BookItem
          title={t("searchResults", { search })}
          books={books}
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={() => navigate(`?page=${page + 1}&search=${search}`)}
          handlePrevPage={() => navigate(`?page=${page - 1}&search=${search}`)}
        />
      ) : (
        <BookItem
          title={t("booksInCategory", { category: categoryName })}
          books={books}
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={() =>
            navigate(`?page=${page + 1}&category=${category}`)
          }
          handlePrevPage={() =>
            navigate(`?page=${page - 1}&category=${category}`)
          }
        />
      )}
    </Container>
  );
}

export default BookPage;
