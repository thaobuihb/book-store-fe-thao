import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBooks,
  getDiscountedBooks,
  getNewlyReleasedBooks,
  getBooksByCategory,
  getCategoryOfBooks,
} from "../features/book/bookSlice";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";
import BookItem from "../features/book/bookItem";
import PaginationControls from "../components/PaginationControls";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    books,
    discountedBooks,
    newlyReleasedBooks,
    booksByCategory,
    categoryOfBooks,
  } = useSelector((state) => state.book);

  //phân trang
  const [currentPage, setCurrentPage] = useState({
    discounted: 1,
    newReleases: 1,
    category: 1,
  });

  const booksPerPage = 7;
  // Tính tổng số trang
  const totalPages = {
    discounted: Math.ceil(discountedBooks.length / booksPerPage),
    newReleases: Math.ceil(newlyReleasedBooks.length / booksPerPage),
    category: Math.ceil(booksByCategory.length / booksPerPage),
  };

  const [slideshowBooks, setSlideshowBooks] = useState([]);

  const getRandomBooks = useCallback(() => {
    const randomBooks = [];
    const bookSet = new Set();

    while (bookSet.size < 3 && books.length > 0) {
      const randomIndex = Math.floor(Math.random() * books.length);
      bookSet.add(books[randomIndex]);
    }

    randomBooks.push(...bookSet);
    setSlideshowBooks(randomBooks);
  }, [books]);

  useEffect(() => {
    dispatch(getBooks());
    dispatch(getDiscountedBooks());
    dispatch(getNewlyReleasedBooks());
    dispatch(getCategoryOfBooks());
    dispatch(getBooksByCategory("66ee3a6f1191f821c77c5708"));
  }, [dispatch]);

  const getCurrentBooks = (books, category) => {
    const startIndex = (currentPage[category] - 1) * booksPerPage;
    return books.slice(startIndex, startIndex + booksPerPage);
  };

  const handlePageChange = (category, direction) => {
    setCurrentPage((prev) => {
      const newPage = prev[category] + direction;
      return {
        ...prev,
        [category]: Math.max(1, Math.min(newPage, totalPages[category])),
      };
    });
  };

  useEffect(() => {
    if (books.length > 0) {
      getRandomBooks();
      const interval = setInterval(() => {
        getRandomBooks();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [books, getRandomBooks]);

  const handleCategoryOfBookClick = (categoryId) => {
    if (categoryId) {
      navigate(`/books?category=${categoryId}`);
    } else {
      navigate(`/books`);
    }
  };

  const SlideshowContainer = styled("div")({
    width: "100%",
    height: "400px",
    backgroundImage: `url('/slideshowBooksBI.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderRadius: "10px",
  });

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <Container maxWidth={false} sx={{ width: "95%", margin: "0 auto" }}>
      <SlideshowContainer>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Grid container spacing={3} justifyContent="center">
            {slideshowBooks.map((book) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3.5}
                key={book._id}
                display="flex"
                justifyContent="center"
              >
                <Card
                  sx={{
                    width: 300,
                    height: 370,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    m: 3,
                    boxShadow: 3,
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <CardActionArea onClick={() => handleBookClick(book._id)}>
                    {/* Ảnh bìa sách */}
                    <Box
                      sx={{
                        width: "100%",
                        height: 280,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={book.img}
                        alt="Book Cover"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "5px",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        mt: 1,
                        fontSize: "18px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "90%",
                      }}
                    >
                      {book.name}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </SlideshowContainer>

      {/* Các phần sách mới phát hành */}
      <Typography
        component="h4"
        gutterBottom
        sx={{ fontSize: "22px", fontWeight: "bold", mt: 3 }}
        align="left"
      >
        New Releases
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center">
        <PaginationControls
          category="newReleases"
          position="left"
          onPageChange={handlePageChange}
          currentPage={currentPage.newReleases}
          totalPages={totalPages.newReleases}
        />

        {/* Danh sách sách */}
        <Box sx={{ flex: "1", mx: 2 }}>
          <BookItem
            books={getCurrentBooks(newlyReleasedBooks, "newReleases")}
          />
        </Box>
        <PaginationControls
          category="newReleases"
          position="right"
          onPageChange={handlePageChange}
          currentPage={currentPage.newReleases}
          totalPages={totalPages.newReleases}
        />
      </Box>

      {/* Các sách giảm giá*/}

      <Typography
        component="h4"
        gutterBottom
        sx={{ fontSize: "22px", fontWeight: "bold", mt: 3 }}
        align="left"
      >
        Discount
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center">
        <PaginationControls
          category="discounted"
          position="left"
          onPageChange={handlePageChange}
          currentPage={currentPage.discounted}
          totalPages={totalPages.discounted}
        />
        <Box sx={{ flex: "1", mx: 2 }}>
          <BookItem books={getCurrentBooks(discountedBooks, "discounted")} />
        </Box>
        <PaginationControls
          category="discounted"
          position="right"
          onPageChange={handlePageChange}
          currentPage={currentPage.discounted}
          totalPages={totalPages.discounted}
        />
      </Box>

      {/* Phần Danh mục Phổ Biến */}
      <section>
        <Typography
          component="h4"
          gutterBottom
          sx={{ fontSize: "25px", fontWeight: "bold", mt: 3 }}
        >
          Popular Categories in Books
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {Array.isArray(categoryOfBooks) &&
            categoryOfBooks.slice(0, 6).map((category) => (
              <Grid item key={category.id} xs={6} sm={4} md={3} lg={2}>
                <Card
                  sx={{
                    width: "220px",
                    height: "220px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    m: 1,
                    boxShadow: 3,
                    borderRadius: "10px",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCategoryOfBookClick(category.id)}
                  >
                    {/* Tên danh mục */}
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "5px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {category.name}
                    </Typography>

                    {/* Hình ảnh danh mục */}
                    {category.sampleBookImage && (
                      <CardMedia
                        component="img"
                        image={category.sampleBookImage}
                        alt={category.name}
                        sx={{
                          width: "100%",
                          height: "150px",
                          objectFit: "contain",
                          borderRadius: "5px",
                        }}
                      />
                    )}

                    {/* Số lượng sách */}
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                      sx={{
                        marginTop: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {category.count} books
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </section>

      {/* Các sách giảm giá*/}

      <Typography
        component="h4"
        gutterBottom
        sx={{ fontSize: "22px", fontWeight: "bold", mt: 3 }}
        align="left"
      >
        Teens & YA Books
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ marginBottom: 3 }}
      >
        <PaginationControls
          category="category"
          position="left"
          onPageChange={handlePageChange}
          currentPage={currentPage.category}
          totalPages={totalPages.category}
        />
        <Box sx={{ flex: "1", mx: 2 }}>
          <BookItem books={getCurrentBooks(booksByCategory, "category")} />
        </Box>
        <PaginationControls
          category="category"
          position="right"
          onPageChange={handlePageChange}
          currentPage={currentPage.category}
          totalPages={totalPages.category}
        />
      </Box>
    </Container>
  );
};

export default Home;
