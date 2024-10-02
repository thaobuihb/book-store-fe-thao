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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import BookItem from "../features/book/bookItem";

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
  const {
    books,
    discountedBooks,
    newlyReleasedBooks,
    booksByCategory,
    categoryOfBooks,
  } = useSelector((state) => state.book);
  console.log("12345#", categoryOfBooks);
  const [slideshowBooks, setSlideshowBooks] = useState([]);

  const booksPerPage = 5;
  const totalDiscountedPages = Math.ceil(discountedBooks.length / booksPerPage);
  const totalNewReleasePages = Math.ceil(
    newlyReleasedBooks.length / booksPerPage
  );
  const totalCategoryPages = Math.ceil(booksByCategory.length / booksPerPage);
  const [currentDiscountedPage, setCurrentDiscountedPage] = useState(1);
  const [currentNewReleasePage, setCurrentNewReleasePage] = useState(1);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);

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

  useEffect(() => {
    if (books.length > 0) {
      getRandomBooks();
      const interval = setInterval(() => {
        getRandomBooks();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [books, getRandomBooks]);


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
    if (currentCategoryPage < totalCategoryPages) {
      setCurrentCategoryPage(currentCategoryPage + 1);
    }
  };

  const handlePrevCategoryPage = () => {
    if (currentCategoryPage > 1) {
      setCurrentCategoryPage(currentCategoryPage - 1);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  const handleCategoryOfBookClick = (categoryId) => {
    console.log("handleCategoryOfBookClick - Clicked categoryId:", categoryId);  // Kiểm tra xem categoryId có được truyền đúng không
    if (categoryId) {
      navigate(`/books?category=${categoryId}`);
    } else {
      navigate(`/books`); 
    }
  };

  // Tính toán sách hiển thị theo trang
  const currentDiscountedBooks = discountedBooks.slice(
    (currentDiscountedPage - 1) * booksPerPage,
    currentDiscountedPage * booksPerPage
  );

  const currentNewlyReleasedBooks = newlyReleasedBooks.slice(
    (currentNewReleasePage - 1) * booksPerPage,
    currentNewReleasePage * booksPerPage
  );

  const currentCategoryBooks = booksByCategory.slice(
    (currentCategoryPage - 1) * booksPerPage,
    currentCategoryPage * booksPerPage
  );
  console.log(slideshowBooks);
  return (
    <Container>
      <SlideshowContainer>
        <Grid container spacing={2}>
          {slideshowBooks.map((book) => (
            <Grid item xs={12} sm={4} key={book._id}>
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
                <CardActionArea onClick={() => handleBookClick(book._id)}>
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

      <BookItem
        title="New Releases"
        books={currentNewlyReleasedBooks}
        handleBookClick={handleBookClick}
        currentPage={currentNewReleasePage}
        totalPages={totalNewReleasePages}
        handleNextPage={handleNextNewReleasePage}
        handlePrevPage={handlePrevNewReleasePage}
      />

      <BookItem
        title="Discount"
        books={currentDiscountedBooks}
        handleBookClick={handleBookClick}
        currentPage={currentDiscountedPage}
        totalPages={totalDiscountedPages}
        handleNextPage={handleNextDiscountedPage}
        handlePrevPage={handlePrevDiscountedPage}
      />

      {/* Phần Danh mục Phổ Biến */}
      <section>
        <Typography variant="h4" gutterBottom>
          Popular Categories in Books
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {Array.isArray(categoryOfBooks) &&
            categoryOfBooks.slice(0, 6).map((category) => (
              <Grid item key={category.id} xs={2}>
                {console.log("Category ID:", category.id)} 
                <Card
                  sx={{
                    maxWidth: 250,
                    height: 250,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    alignSelf: "center",
                    m: 3,
                  }}
                >
                  <CardActionArea onClick={() => handleCategoryOfBookClick(category.id)}>
                    <Typography variant="h6" align="center" sx={{fontSize:'15px'}}>
                      {category.name}
                    </Typography>
                    {category.sampleBookImage && (
                      <CardMedia
                        component="img"
                        image={category.sampleBookImage}
                        alt={category.name} 
                        sx={{
                          width: "100%",
                          height: "60%", 
                          objectFit: "cover",
                        }}
                      />
                    )}
                    {/* Hiển thị số lượng sách trong danh mục */}
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      {category.count} books
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </section>

      <BookItem
        title="Teens & YA Books"
        books={currentCategoryBooks}
        handleBookClick={handleBookClick}
        currentPage={currentCategoryPage}
        totalPages={totalCategoryPages}
        handleNextPage={handleNextCategoryPage}
        handlePrevPage={handlePrevCategoryPage}
      />
    </Container>
  );
};

export default Home;
