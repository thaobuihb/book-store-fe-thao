import React, { useState } from "react";
import { Grid, Card, CardMedia, CardActionArea, Typography, IconButton, Box, Modal, Button } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

// Styles cho modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const BookItem = ({ title, books, handleBookClick, currentPage, totalPages, handleNextPage, handlePrevPage }) => {
  const [hoveredBook, setHoveredBook] = useState(null); // Để xác định sách đang được hover
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal

  const handleMouseEnter = (book) => {
    setHoveredBook(book);
    setIsModalOpen(true); // Mở modal khi hover
  };

  const handleMouseLeave = () => {
    setIsModalOpen(false); // Đóng modal khi rời khỏi thẻ sách
  };

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
                position: "relative",
              }}
              onMouseEnter={() => handleMouseEnter(book)}
              onMouseLeave={handleMouseLeave}
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

      {/* Modal hiển thị khi hover */}
      <Modal open={isModalOpen} onClose={handleMouseLeave}>
        <Box sx={modalStyle}>
          {hoveredBook && (
            <>
              <Typography variant="h6" component="h2">
                {hoveredBook.title}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {hoveredBook.description}
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Add to Cart
              </Button>
            </>
          )}
        </Box>
      </Modal>

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
