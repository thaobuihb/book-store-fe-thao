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
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const Slideshow = ({ books }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <SlideshowContainer>
      <Grid container spacing={2} justifyContent="center">
        {books.map((book) => (
          <Grid item xs={10} sm={6} md={4} lg={3.5} key={book._id}>
            <Card
              sx={{
                width: isMobile ? 180 : 280,
                height: isMobile ? 260 : 370,
                m: isMobile ? 1 : 2,
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
