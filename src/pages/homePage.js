import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDiscountedBooks, getNewlyReleasedBooks } from "../features/book/bookSlice";
import { Container, Typography, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

// Styled component cho Slideshow
const SlideshowContainer = styled('div')({
  width: '100%',
  height: '300px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
});

// Styled component cho Book Card
const BookCard = styled(Card)({
  maxWidth: 200,
  margin: '10px',
});

// Dữ liệu giả lập cho slideshow
const slideshowData = [
  { id: 1, image: 'https://via.placeholder.com/300x300', title: 'Sách Giới thiệu 1' },
  { id: 2, image: 'https://via.placeholder.com/300x300', title: 'Sách Giới thiệu 2' },
  { id: 3, image: 'https://via.placeholder.com/300x300', title: 'Sách Giới thiệu 3' },
];

const Home = () => {
  const dispatch = useDispatch();
  const { discountedBooks, newlyReleasedBooks } = useSelector((state) => state.book);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5; 
  const totalPages = Math.ceil(discountedBooks.length / booksPerPage);

  useEffect(() => {
    dispatch(getDiscountedBooks());
    dispatch(getNewlyReleasedBooks());
  }, [dispatch]);

  // Tính toán sách giảm giá hiển thị theo trang
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentDiscountedBooks = discountedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container>
      {/* Slide giới thiệu sách */}
      <SlideshowContainer>
        {slideshowData.map((slide) => (
          <img key={slide.id} src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ))}
      </SlideshowContainer>

      {/* Sách mới phát hành */}
      <section>
        <Typography variant="h4" gutterBottom>
          Sách mới phát hành
        </Typography>
        <Grid container spacing={2}>
          {newlyReleasedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <BookCard>
                <CardMedia
                  component="img"
                  alt={book.title}
                  height="140"
                  image={book.image}
                />
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{book.author}</Typography>
                </CardContent>
              </BookCard>
            </Grid>
          ))}
        </Grid>
      </section>

      {/* Sách giảm giá */}
      <section>
        <Typography variant="h4" gutterBottom>
          Sách giảm giá
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {currentDiscountedBooks.map((book) => (
            <Grid item key={book.id}>
              <BookCard>
                <CardMedia
                  component="img"
                  alt={book.title}
                  height="140"
                  image={book.image}
                />
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{book.author}</Typography>
                </CardContent>
              </BookCard>
            </Grid>
          ))}

          {/* Phân trang cho sách giảm giá */}
          <Grid container justifyContent="space-between" alignItems="center" item xs={12}>
            <Grid item>
              <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
                <KeyboardArrowLeft />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                <KeyboardArrowRight />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </section>

      {/* Các danh mục phổ biến trong sách */}
      <section>
        <Typography variant="h4" gutterBottom>
          Các danh mục phổ biến
        </Typography>
        <Typography variant="body1">Danh mục sách phổ biến sẽ được hiển thị ở đây.</Typography>
      </section>

      {/* Sách dành cho thanh thiếu niên & tuổi trẻ */}
      <section>
        <Typography variant="h4" gutterBottom>
          Sách dành cho thanh thiếu niên & tuổi trẻ
        </Typography>
        <Typography variant="body1">Danh sách sách dành cho thanh thiếu niên sẽ được hiển thị ở đây.</Typography>
      </section>

      {/* Giới thiệu về trang sách */}
      <div>
        <Typography variant="h5" gutterBottom>
          Giới thiệu
        </Typography>
        <Typography>
          Đây là trang sách của tôi, nơi bạn có thể tìm thấy nhiều sách hay và thông tin về các danh mục sách khác nhau.
        </Typography>
      </div>
    </Container>
  );
};

export default Home;
