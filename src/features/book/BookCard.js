import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

 function BookCard({ book }) {
  return (
    <Card
      sx={{
        maxWidth: 300,
        height: 450,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        alignSelf: "center",
        m: 3,
      }}
    >
      <CardActionArea
        sx={{
          height: "100%",
        }}
      >
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
  );
}

export default BookCard;