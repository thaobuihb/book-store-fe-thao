import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const SlideshowContainer = styled("div")(({ theme }) => ({
  width: "100%",
  backgroundImage: `url('/slideshowBooksBI.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",

  minHeight: 320,
  [theme.breakpoints.down("md")]: {
    minHeight: 280,
  },
  [theme.breakpoints.down("sm")]: {
    minHeight: 240,
    padding: theme.spacing(1),
  },
}));

const Slideshow = ({ books }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const displayBooks = isMobile ? books.slice(0, 1) : books.slice(0, 3);

  return (
    <SlideshowContainer>
      <Grid container spacing={2} justifyContent="center">
        {displayBooks.map((book) => (
          <Grid item xs={10} sm={6} md={4} key={book._id}>
            <Card
              sx={{
                width: isMobile ? 200 : 280,
                height: isMobile ? 260 : 370,
                m: 1,
                p: 1,
                boxShadow: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CardActionArea onClick={() => navigate(`/book/${book._id}`)}>
                <Box
                  sx={{
                    height: isMobile ? 160 : 280,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt="Book Cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    mt: 1,
                    fontSize: isMobile ? 14 : 18,
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "90%",
                  }}
                >
                  {book.name}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </SlideshowContainer>
  );
};

export default Slideshow;
