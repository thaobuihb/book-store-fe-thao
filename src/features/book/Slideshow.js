import React from "react";
import {
  Card,
  CardMedia,
  CardActionArea,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const SlideshowContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundImage: `url('/slideshowBooksBI.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
  height: 300,
  [theme.breakpoints.down("sm")]: {
    height: 260,
  },
}));

const Slideshow = ({ books }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const displayBooks = isMobile ? books.slice(0, 1) : books.slice(0, 3);

  return (
    <SlideshowContainer>
      {isMobile ? (
        // 👉 MOBILE: hiển thị duy nhất 1 sách
        <Box
          sx={{
            width: "90%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              width: "100%",
              height: 230,
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <CardActionArea onClick={() => navigate(`/book/${displayBooks[0]._id}`)}>
              <CardMedia
                component="img"
                image={displayBooks[0].img}
                alt={displayBooks[0].name}
                sx={{
                  width: "100%",
                  height: 160,
                  objectFit: "contain",
                }}
              />
              <Typography
                variant="body2"
                align="center"
                sx={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mt: 1,
                }}
              >
                {displayBooks[0].name}
              </Typography>
            </CardActionArea>
          </Card>
        </Box>
      ) : (
        // 👉 DESKTOP: dùng Grid bình thường
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {displayBooks.map((book) => (
            <Grid item key={book._id}>
              <Card
                sx={{
                  width: 240,
                  height: 300,
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardActionArea onClick={() => navigate(`/book/${book._id}`)}>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt={book.name}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      mt: 1,
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
    </SlideshowContainer>
  );  
};

export default Slideshow;
