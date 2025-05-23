import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  CardActionArea,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";

const Slideshow = ({ books }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const displayBooks = isMobile
    ? books.slice(0, 1)
    : books.length >= 5
    ? books.slice(0, 5)
    : books;
  const navigate = useNavigate();
  const handleClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 260, sm: 320, md: 400 },
        backgroundColor: "#fce4ec",
        backgroundImage: `url('/slideshowBooksBI.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 2,
        px: 2,
      }}
    >
      {isMobile ? (
        displayBooks.length > 0 && (
          <Card sx={{ width: "90%", height: 230, boxShadow: 3 }}>
            <CardActionArea onClick={() => handleClick(displayBooks[0]._id)}>
              <CardMedia
                component="img"
                image={displayBooks[0].img}
                alt={displayBooks[0].name}
                sx={{ height: 160, objectFit: "contain", mt: 4 }}
              />
              <Typography
                align="center"
                sx={{
                  mt: 1,
                  px: 1,
                  fontSize: 14,
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayBooks[0].name}
              </Typography>
            </CardActionArea>
          </Card>
        )
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {displayBooks.map((book) => (
            <Grid item key={book._id}>
              <Card sx={{ width: 240, height: 300, boxShadow: 3 }}>
                <CardActionArea onClick={() => handleClick(book._id)} a>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt={book.name}
                    sx={{ height: 200, objectFit: "contain", mt: 4 }}
                  />
                  <Typography
                    align="center"
                    sx={{
                      mt: 1,
                      px: 1,
                      fontSize: 16,
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {book.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Slideshow;
