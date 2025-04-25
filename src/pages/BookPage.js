import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../features/book/bookSlice";
import { getCategories } from "../features/category/categorySlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import BookItem from "../features/book/bookItem";
import PaginationControls from "../components/PaginationControls";
import { useTranslation } from "react-i18next";

function BookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const { books, totalPages, currentPage } = useSelector((state) => state.book);
  console.log("📦 Redux books:", books);
  console.log("📘 Redux currentPage:", currentPage, typeof currentPage);
  console.log("📄 Redux totalPages:", totalPages, typeof totalPages);

  const categories = useSelector((state) => state.category.categories);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [categoryName, setCategoryName] = useState("");

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    const rawQuery = searchParams.get("search");
    const isQueryEmpty = rawQuery !== null && rawQuery.trim() === "";

    if (isQueryEmpty && !category) {
      navigate("/", { replace: true, state: { fromSearchClear: true } });
    }
  }, [searchParams, category, navigate]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const minPrice = 0;
    const maxPrice = 1000000;

    dispatch(getBooks({ page, search, minPrice, maxPrice, category }));

    if (category) {
      const selectedCategory = categories.find((cat) => cat._id === category);
      setCategoryName(
        selectedCategory ? selectedCategory.categoryName : "Unknown Category"
      );
    }
  }, [dispatch, search, category, page, categories]);

  const getTitle = () => {
    if (search) return t("searchResults", { search });
    if (category) return t("booksInCategory", { category: categoryName });
    return t("allBooks");
  };

  return (
    <Container maxWidth="lg">
      <BookItem
        title={getTitle()}
        books={books}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => handlePageChange(page + 1)}
        handlePrevPage={() => handlePageChange(page - 1)}
      />
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: 20,
          transform: "translateY(-50%)",
          zIndex: 1500,
        }}
      >
        <PaginationControls
          category={category || search ? "filtered" : "all"}
          position="left"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(cat, direction) => handlePageChange(page + direction)}
        />
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          right: 20,
          transform: "translateY(-50%)",
          zIndex: 1500,
        }}
      >
        <PaginationControls
          category={category || search ? "filtered" : "all"}
          position="right"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(cat, direction) => handlePageChange(page + direction)}
        />
      </Box>
    </Container>
  );
}

export default BookPage;
