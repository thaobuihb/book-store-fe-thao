import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBooks,
  getDiscountedBooks,
  getNewlyReleasedBooks,
  getBooksByCategory,
} from "../features/book/bookSlice";
import { getPopularCategories } from "../features/category/categorySlice"; // Import getPopularCategories
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  CardActionArea,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

// Styled component cho Slideshow
const SlideshowContainer = styled("div")({
  width: "100%",
  height: "100%",
  backgroundColor: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
});

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, discountedBooks, newlyReleasedBooks, booksByCategory } =
    useSelector((state) => state.book);
  const { popularCategories } = useSelector((state) => state.category); // Lấy danh mục phổ biến từ Redux
  const [slideshowBooks, setSlideshowBooks] = useState([]);
  

  const booksPerPage = 5;
  const totalDiscountedPages = Math.ceil(discountedBooks.length / booksPerPage);
  const totalNewReleasePages = Math.ceil(
    newlyReleasedBooks.length / booksPerPage
  );
  const totalCategoryPages = Math.ceil(booksByCategory.length / booksPerPage); // Tính tổng số trang cho danh mục
  const [currentDiscountedPage, setCurrentDiscountedPage] = useState(1);
  const [currentNewReleasePage, setCurrentNewReleasePage] = useState(1);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1); // Trạng thái cho trang của danh mục

  // Hàm để chọn 3 sách ngẫu nhiên cho slideshow
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
    dispatch(getNewlyReleasedBooks()); // Lấy sách mới phát hành
    dispatch(getPopularCategories()); // Lấy danh mục phổ biến
  }, [dispatch]);

  // Cập nhật sách ngẫu nhiên sau mỗi 30 giây
  useEffect(() => {
    if (books.length > 0) {
      getRandomBooks(); // Chọn 3 sách ngẫu nhiên khi có dữ liệu
      const interval = setInterval(() => {
        getRandomBooks(); // Cập nhật sách ngẫu nhiên sau mỗi 30 giây
      }, 10000);

      return () => clearInterval(interval); // Xóa interval khi component unmount
    }
  }, [books, getRandomBooks]);

  useEffect(() => {
    dispatch(getBooksByCategory("66ee3a6f1191f821c77c5708"));
  }, [dispatch]);

  const handleNextDiscountedPage = () => {
    if (currentDiscountedPage < totalDiscountedPages) {
      setCurrentDiscountedPage(currentDiscountedPage + 1);
    }
  };

  const handlePrevDiscountedPage = () => {
    if (currentDiscountedPage > 1) {
      setCurrentDiscountedPage(currentDiscountedPage - 1);
    }
  };

  const handleNextNewReleasePage = () => {
    if (currentNewReleasePage < totalNewReleasePages) {
      setCurrentNewReleasePage(currentNewReleasePage + 1);
    }
  };

  const handlePrevNewReleasePage = () => {
    if (currentNewReleasePage > 1) {
      setCurrentNewReleasePage(currentNewReleasePage - 1);
    }
  };

  const handleNextCategoryPage = () => {
    // Hàm cho trang danh mục
    if (currentCategoryPage < totalCategoryPages) {
      setCurrentCategoryPage(currentCategoryPage + 1);
    }
  };

  const handlePrevCategoryPage = () => {
    // Hàm cho trang danh mục
    if (currentCategoryPage > 1) {
      setCurrentCategoryPage(currentCategoryPage - 1);
    }
  };

  // Điều hướng tới trang chi tiết sách
  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Tính toán sách giảm giá hiển thị theo trang
  const indexOfLastDiscountedBook = currentDiscountedPage * booksPerPage;
  const indexOfFirstDiscountedBook = indexOfLastDiscountedBook - booksPerPage;
  const currentDiscountedBooks = discountedBooks.slice(
    indexOfFirstDiscountedBook,
    indexOfLastDiscountedBook
  );

  // Tính toán sách mới phát hành hiển thị theo trang
  const indexOfLastNewReleaseBook = currentNewReleasePage * booksPerPage;
  const indexOfFirstNewReleaseBook = indexOfLastNewReleaseBook - booksPerPage;
  const currentNewlyReleasedBooks = newlyReleasedBooks.slice(
    indexOfFirstNewReleaseBook,
    indexOfLastNewReleaseBook
  );

  // Tính toán sách theo danh mục hiển thị theo trang
  const indexOfLastCategoryBook = currentCategoryPage * booksPerPage;
  const indexOfFirstCategoryBook = indexOfLastCategoryBook - booksPerPage;
  const currentCategoryBooks = booksByCategory.slice(
    indexOfFirstCategoryBook,
    indexOfLastCategoryBook
  );

  return (
    <Container>
      {/* Slide giới thiệu sách */}
      <SlideshowContainer>
        <Grid container spacing={2}>
          {slideshowBooks.map((book) => (
            <Grid item xs={12} sm={4} key={book.id}>
              <Card
                sx={{
                  maxWidth: 300,
                  height: 300,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignSelf: "center",
                  m: 3,
                }}
              >
                <CardActionArea onClick={() => handleBookClick(book.id)}>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt="Book Cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </SlideshowContainer>

      {/* Sách mới phát hành */}
      <section>
        <Typography variant="h4" gutterBottom>
        New Releases
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {currentNewlyReleasedBooks.map((book) => (
            <Grid item key={book.id}>
              <Card
                sx={{
                  maxWidth: 250,
                  height: 200,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignSelf: "center",
                  m: 3,
                }}
              >
                <CardActionArea onClick={() => handleBookClick(book.id)}>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt="Book Cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Phân trang cho sách mới phát hành */}
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          item
          xs={12}
        >
          <Grid item>
            <IconButton
              onClick={handlePrevNewReleasePage}
              disabled={currentNewReleasePage === 1}
            >
              <KeyboardArrowLeft />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleNextNewReleasePage}
              disabled={currentNewReleasePage === totalNewReleasePages}
            >
              <KeyboardArrowRight />
            </IconButton>
          </Grid>
        </Grid>
      </section>

      {/* Sách giảm giá */}
      <section>
        <Typography variant="h4" gutterBottom>
        Discount
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {currentDiscountedBooks.map((book) => (
            <Grid item key={book.id}>
              <Card
                sx={{
                  maxWidth: 250,
                  height: 200,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignSelf: "center",
                  m: 3,
                }}
              >
                <CardActionArea onClick={() => handleBookClick(book.id)}>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt="Book Cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Phân trang cho sách giảm giá */}
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          item
          xs={12}
        >
          <Grid item>
            <IconButton
              onClick={handlePrevDiscountedPage}
              disabled={currentDiscountedPage === 1}
            >
              <KeyboardArrowLeft />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleNextDiscountedPage}
              disabled={currentDiscountedPage === totalDiscountedPages}
            >
              <KeyboardArrowRight />
            </IconButton>
          </Grid>
        </Grid>
      </section>
      {/* Phần Danh mục Phổ Biến */}
      <section>
        <Typography variant="h4" gutterBottom>
        Popular Categories in Books
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {popularCategories.map((category) => (
            <Grid item key={category.id} xs={2}>
              <Card
                sx={{
                  maxWidth: 250,
                  height: 100,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  m: 3,
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/categories/${category.id}`)}
                >
                  <Typography variant="h6" align="center">
                    {category.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>
      {/* Sách theo danh mục Teens & YA */}
      <section>
        <Typography variant="h4" gutterBottom>
          Teens & YA Books
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {currentCategoryBooks.map((book) => (
            <Grid item key={book.id} xs={2}>
              <Card
                sx={{
                  maxWidth: 200,
                  height: 200,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignSelf: "center",
                  m: 3,
                }}
              >
                <CardActionArea onClick={() => handleBookClick(book.id)}>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt="Book Cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Phân trang cho danh mục Teens & YA */}
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          item
          xs={12}
        >
          <Grid item>
            <IconButton
              onClick={handlePrevCategoryPage}
              disabled={currentCategoryPage === 1}
            >
              <KeyboardArrowLeft />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleNextCategoryPage}
              disabled={currentCategoryPage === totalCategoryPages}
            >
              <KeyboardArrowRight />
            </IconButton>
          </Grid>
        </Grid>
      </section>
    </Container>
  );
};

export default Home;
