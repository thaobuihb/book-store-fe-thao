import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from "react-router-dom";

const BookItem = ({
  title,
  books,
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
}) => {
  // console.log("BOOk", books)
  const bookList = Array.isArray(books) ? books : [];

  const navigate = useNavigate();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <section>
      <Typography
        component="h4"
        align="left"
        gutterBottom
        sx={{ fontSize: "25px", fontWeight: "bold" }}
      >
        {title}
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {bookList.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No books available.
          </Typography>
        ) : (
          bookList.map((book) => (
            <Grid
              item
              xs={2.3}
              sm={2.3}
              md={2.3}
              key={book._id}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 350,
                }}
              >
                {/* Bìa sách */}
                <CardMedia
                  component="img"
                  image={book.img}
                  alt={book.title}
                  onClick={() => handleBookClick(book._id)}
                  sx={{
                    height: 220,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />

                {/* Tiêu đề sách */}
                <Typography
                  variant="h6"
                  component="h2"
                  onClick={() => handleBookClick(book._id)}
                  sx={{ p: 1, cursor: "pointer", flexGrow: 1 }}
                >
                  {book.title}
                </Typography>

                {/* Hiển thị thông tin giá */}
                <Box sx={{ p: 2, paddingTop: "20px" }}>
                  {book.discountedPrice ? (
                    <>
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: "line-through", color: "gray" }}
                      >
                        {`$${book.price}`}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "green" }}
                      >
                        {`$${book.discountedPrice}`}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {`$${book.price}`}
                    </Typography>
                  )}
                </Box>

                {/* Icon giỏ hàng và wishlist */}
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ padding: "5px", marginTop: "auto" }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => {
                      // Logic để thêm vào giỏ hàng
                    }}
                  >
                    <AddShoppingCartIcon sx={{ color: "#0000FF" }} />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      // Logic để thêm vào wishlist
                    }}
                  >
                    <FavoriteIcon sx={{ color: "#0000FF" }} />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Nút phân trang */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="16px">
        <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
          <ArrowLeftIcon />
        </IconButton>
        <Typography variant="body1">
          {currentPage} of {totalPages}
        </Typography>
        <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
          <ArrowRightIcon />
        </IconButton>
      </Box>
    </section>
  );
};

export default BookItem;
