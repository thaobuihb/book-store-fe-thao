import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BookItem = ({
  title,
  books,
  handleBookClick,
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
}) => {
  return (
    <section>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {books.map((book) => (
          <Grid item xs={2.4} sm={2.4} md={2.4} key={book._id}>
            <Card>
              <CardActionArea onClick={() => handleBookClick(book._id)}>
                <CardMedia
                  component="img"
                  image={book.img}
                  alt={book.title}
                  sx={{
                    height: 200,
                    objectFit: "cover",
                  }}
                />
                <Typography variant="h6" component="h2" sx={{ p: 1 }}>
                  {book.title}
                </Typography>
              </CardActionArea>
              <div style={{ padding: "2px", display: "flex", justifyContent: "center" }}>
                <IconButton color="primary" onClick={() => {/* logic để thêm vào giỏ hàng */}}>
                  <AddShoppingCartIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => {/* logic để thêm vào wishlist */}}>
                  <FavoriteIcon />
                </IconButton>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Nút phân trang với biểu tượng */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop="16px"
      >
        <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1">
         {currentPage} of {totalPages}
        </Typography>
        <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </section>
  );
};

export default BookItem;
