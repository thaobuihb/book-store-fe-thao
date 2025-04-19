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
        displayBooks.map((book) => (
          <Card
            key={book._id}
            sx={{
              width: "90%",
              height: 230,
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardActionArea
              onClick={() => navigate(`/book/${book._id}`)}
              sx={{ height: "100%" }}
            >
              <Box
                sx={{
                  height: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                }}
              >
                <CardMedia
                  component="img"
                  image={book.img}
                  alt={book.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  px: 1,
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
        ))
      ) : (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {displayBooks.map((book) => (
            <Grid item key={book._id}>
              <Card
                sx={{
                  width: 240,
                  height: 300,
                  boxShadow: 3,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/book/${book._id}`)}
                  sx={{ height: "100%" }}
                >
                  <Box
                    sx={{
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={book.img}
                      alt={book.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{
                      px: 1,
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
    </SlideshowContainer>
  );
};

export default Slideshow;
