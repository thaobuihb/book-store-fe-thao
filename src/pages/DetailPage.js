import React, { useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux"; 
import { getSingleBook, getBooks } from "../features/book/bookSlice"; 
import { Box, Typography, Button, IconButton, TextField } from "@mui/material"; 
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"; 
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookItem from "../features/book/bookItem"; 

const DetailPage = () => {
  const { bookId } = useParams(); 
  const dispatch = useDispatch();
  const { book, books } = useSelector((state) => state.book); 

  useEffect(() => {
    const fetchBookData = async () => {
      await dispatch(getSingleBook(bookId));  // Lấy chi tiết sách
      if (book?.category) {  // Kiểm tra nếu có category ID
        dispatch(getBooks(1, "", "", "", book.category));  // Lấy sách cùng danh mục theo category ID
      }
    };

    fetchBookData();
  }, [dispatch, bookId, book?.category]);
  return (
    <Box sx={{ padding: 4 }}>
      {/* Phần trên */}
      <Box sx={{ display: "flex", justifyContent: "space-between", m: 10 }}>
        {/* Hình ảnh sách và mô tả */}
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Box
            component="img"
            src={book.img} 
            alt={book.name} 
            sx={{ width: "100%", maxHeight: "400px", objectFit: "contain" }} 
          />
          <Box component="a" sx={{ mt: 2 }}>
            <Typography variant="h5">{book.name}</Typography> 
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Author: {book.author}</Typography>{" "}
            <Typography sx={{ fontSize: "1.1rem" }} variant="body2">
              Descriptions: {book.description}
            </Typography>{" "}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Reviews: {book.review}</Typography>
              <Typography variant="h6">
                Rating: {book.rating}
              </Typography>{" "}
              <Button variant="outlined" sx={{ mt: 1 }}>
                Write a Review
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Thông tin sách và các nút thao tác */}
        <Box
          sx={{
            background: "#B2EBF2",
            width: "30%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 1,
          }}
        >
          <Box sx={{ m: 5 }}>
            <Typography sx={{ m: 5 }} variant="h6">
              Price: ${book.price}
            </Typography>{" "}
            <Typography sx={{ m: 5 }} variant="h6">
              Discount: ${book.discountedPrice}
            </Typography>{" "}
            <Typography variant="body2">Publisher: {book.publisher}</Typography> 
            <Typography sx={{ m: 5 }} variant="body2">
              Publication Date: {book.publicationDate}
            </Typography>
            <Typography sx={{ m: 5 }} variant="body2">
              ISBN: {book.isbn}
            </Typography>{" "}
            <Typography sx={{ m: 5 }} variant="body2">
              Category: {book.categoryName}
            </Typography>{" "}
          </Box>

          {/* Các nút thao tác */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", m: 5 }}>
              <IconButton sx={{ color: "black" }}>-</IconButton>{" "}
              <TextField value="1" sx={{ width: "50px", mx: 1 }} />{" "}
              <IconButton sx={{ color: "black" }}>+</IconButton>{" "}
            </Box>
            <Button
              variant="contained"
              startIcon={<ShoppingCartOutlinedIcon />}
              sx={{ m: 2 }}
            >
              Add to Cart
            </Button>
            <Button variant="contained" color="secondary" sx={{ m: 2 }}>
              Buy Now
            </Button>
            <IconButton color="primary">
              <FavoriteBorderIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Phần dưới: Sách cùng thể loại */}
      <Box>
        <BookItem books={books} title="Books from the Same Category" />
      </Box>
    </Box>
  );
};

export default DetailPage;
