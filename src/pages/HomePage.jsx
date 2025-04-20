console.log("🔥 File HomePage.jsx đã được import");

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBooks,
  getDiscountedBooks,
  getNewlyReleasedBooks,
  getBooksByCategory,
  getCategoryOfBooks,
} from "../features/book/bookSlice";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Slideshow from "../features/book/Slideshow";
import BookSection from "../features/book/BookSection";
import CategoryList from "../features/category/CategoryList";

const booksPerPage = 7;
const categoryIdForKids = "66ee3a6f1191f821c77c5708";

const Home = () => {
  console.log("🏁 Component Home đã được render!");

  useEffect(() => {
    console.log("📦 useEffect của HomePage chạy!");
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    books,
    discountedBooks,
    newlyReleasedBooks,
    booksByCategory,
    categoryOfBooks,
  } = useSelector((state) => state.book);
  console.log("Dữ liệu từ Redux:@@@@@", books);

  const [currentPage, setCurrentPage] = useState({
    discounted: 1,
    newReleases: 1,
    category: 1,
  });

  const [slideshowBooks, setSlideshowBooks] = useState([]);
  console.log("Slideshow books:@@@@@", slideshowBooks);

  const totalPages = {
    discounted: Math.ceil(discountedBooks.length / booksPerPage),
    newReleases: Math.ceil(newlyReleasedBooks.length / booksPerPage),
    category: Math.ceil(booksByCategory.length / booksPerPage),
  };

  // const getRandomBooks = useCallback(() => {
  //   const selected = new Set();
  //   while (selected.size < 3 && books.length > 0) {
  //     const randomIndex = Math.floor(Math.random() * books.length);
  //     selected.add(books[randomIndex]);
  //   }
  //   setSlideshowBooks(Array.from(selected));
  // }, [books]);

  const getRandomBooks = useCallback(() => {
    if (books.length === 0) return;
    const selectedBook = books[Math.floor(Math.random() * books.length)];
    setSlideshowBooks([selectedBook]);
    console.log("Đã cập nhật slideshowBooks:@@@@@", [selectedBook]);
  }, [books]);

  const handlePageChange = (category, direction) => {
    setCurrentPage((prev) => {
      const newPage = prev[category] + direction;
      return {
        ...prev,
        [category]: Math.max(1, Math.min(newPage, totalPages[category])),
      };
    });
  };

  const getCurrentBooks = (books, category) => {
    const start = (currentPage[category] - 1) * booksPerPage;
    return books.slice(start, start + booksPerPage);
  };

  const handleCategoryOfBookClick = (categoryId) => {
    navigate(categoryId ? `/books?category=${categoryId}` : "/books");
  };

  useEffect(() => {
    dispatch(getBooks());
    dispatch(getDiscountedBooks());
    dispatch(getNewlyReleasedBooks());
    dispatch(getCategoryOfBooks());
    dispatch(getBooksByCategory(categoryIdForKids));
  }, [dispatch]);

  useEffect(() => {
    console.log("useEffect được kích hoạt! Books:", books);
  }, [books]);

  useEffect(() => {
    console.log("useEffect chạy với books:@@@@@", books);
    if (books.length === 0) return;
    getRandomBooks();
    console.log("Books cập nhật:@@@@@", books);
    const interval = setInterval(getRandomBooks, 2000);
    return () => clearInterval(interval);
  }, [books, getRandomBooks]);

  useEffect(() => {
    console.log("Slideshow books cập nhật:@@@@@", slideshowBooks);
  }, [slideshowBooks]);

  return (
    <Container maxWidth={false} sx={{ width: "95%", mx: "auto" }}>
      <Box sx={{ width: "100%", mb: 4, mt: 2 }}>
        <Slideshow books={slideshowBooks} />
      </Box>

      <BookSection
        sx={{ mt: 5 }}
        title={t("home.newBooks")}
        category="newReleases"
        books={newlyReleasedBooks}
        getCurrentBooks={getCurrentBooks}
        currentPage={currentPage.newReleases}
        totalPages={totalPages.newReleases}
        onPageChange={handlePageChange}
      />

      <BookSection
        title={t("home.discountedBooks")}
        category="discounted"
        books={discountedBooks}
        getCurrentBooks={getCurrentBooks}
        currentPage={currentPage.discounted}
        totalPages={totalPages.discounted}
        onPageChange={handlePageChange}
      />

      <Typography
        component="h4"
        sx={{ fontSize: 25, fontWeight: "bold", mt: 3 }}
        gutterBottom
      >
        {t("home.popularCategories")}
      </Typography>

      <CategoryList
        categories={categoryOfBooks.slice(0, 6)}
        onCategoryClick={handleCategoryOfBookClick}
      />

      <BookSection
        title={t("home.kidsBooks")}
        category="category"
        books={booksByCategory}
        getCurrentBooks={getCurrentBooks}
        currentPage={currentPage.category}
        totalPages={totalPages.category}
        onPageChange={handlePageChange}
        sx={{ mb: 3 }}
      />
    </Container>
  );
};

export default Home;
