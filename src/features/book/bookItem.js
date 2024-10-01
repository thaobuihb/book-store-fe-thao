import React from "react";
import { Grid, Card, CardMedia, CardActionArea, Typography, IconButton, Box } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

const BookItem = ({ title, books, handleBookClick, currentPage, totalPages, handleNextPage, handlePrevPage }) => {
  return (
    <section>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {books.map((book) => (
          <Grid item key={book.id} xs={2}>
            <Card
              sx={{
                maxWidth: 250,
                height: 200,
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignSelf: "center",
                m: 3,
                position: "relative", // Thêm position relative cho Card
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

      {/* Pagination */}
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
    </section>
  );
};

export default BookItem;
