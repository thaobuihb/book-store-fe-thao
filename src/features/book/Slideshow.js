import React from "react";
import { Grid, Card, CardMedia, CardActionArea, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const SlideshowContainer = styled("div")(({ theme }) => ({
  width: "100%",
  height: "400px",
  backgroundImage: `url('/slideshowBooksBI.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius,
}));

const Slideshow = ({ books }) => {
  const navigate = useNavigate();

  return (
    <SlideshowContainer>
      <Grid container spacing={3} justifyContent="center">
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3.5} key={book._id}>
            <Card
              sx={{
                width: 300,
                height: 370,
                m: 3,
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
                <Box sx={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", p: 1 }}>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt="Book Cover"
                    sx={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 1 }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mt: 1, fontSize: 18, fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "90%" }}
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
