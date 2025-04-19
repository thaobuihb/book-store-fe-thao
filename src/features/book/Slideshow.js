import React from "react";
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

  if (!books || books.length === 0) return null;

  const displayBooks = isMobile ? [books[0]] : books.slice(0, 3);

  return (
    <Box
      sx={{
        width: "100%",
        height: isMobile ? 260 : 400,
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 2,
        px: 2,
        position: "relative",
        zIndex: 2,
      }}
    >
      {isMobile ? (
        <Card
          sx={{
            width: "90%",
            height: 220,
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            zIndex: 2,
          }}
        >
          <CardActionArea>
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
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {displayBooks.map((book) => (
            <Grid item key={book._id}>
              <Card sx={{ width: 240, height: 300, boxShadow: 3 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={book.img}
                    alt={book.name}
                    sx={{ height: 200, objectFit: "contain" }}
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
