// DetailPage.js
import React, { useEffect } from "react";
import { useParams } from "react-router-dom"; // Nhập khẩu useParams
import { useDispatch, useSelector } from "react-redux"; // Nhập khẩu useDispatch và useSelector
import { getSingleBook } from "../features/book/bookSlice"; // Nhập khẩu hành động getSingleBook
import { Box, Typography, Button, IconButton, TextField } from "@mui/material"; // Nhập khẩu Box và các thành phần khác từ Material UI
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"; // Nhập khẩu ShoppingCartOutlinedIcon
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookItem from "../features/book/bookItem"; // Nhập khẩu component BookItem (nếu cần sử dụng)

const DetailPage = () => {
  const { bookId } = useParams(); // Lấy bookId từ URL
  const dispatch = useDispatch();
  const { book } = useSelector((state) => state.book); // Lấy thông tin sách từ Redux

  useEffect(() => {
    dispatch(getSingleBook(bookId)); // Gọi API để lấy thông tin sách theo ID
  }, [dispatch, bookId]);

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
            {/* Tác giả */}
            <Typography sx={{ fontSize: "1.1rem" }} variant="body2">
              Descriptions: {book.description}
            </Typography>{" "}
            {/* Mô tả sách */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Reviews: {book.review}</Typography>
              <Typography  variant="h6">
                Rating: {book.rating}
              </Typography>{" "}
              {/* Đánh giá tạm */}
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
            {/* Giá sách */}
            <Typography variant="body2">Publisher: {book.publisher}</Typography> 
            <Typography sx={{ m: 5 }} variant="body2">
              Publication Date: {book.publicationDate}
            </Typography>
            <Typography sx={{ m: 5 }} variant="body2">
              ISBN: {book.isbn}
            </Typography>{" "}
            {/* ISBN */}
            <Typography sx={{ m: 5 }} variant="body2">
              Category: {book.category}
            </Typography>{" "}
            {/* Thể loại */}
          </Box>

          {/* Các nút thao tác */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", m: 5 }}>
              <IconButton sx={{ color: "black" }}>-</IconButton>{" "}
              {/* Nút giảm số lượng */}
              <TextField value="1" sx={{ width: "50px", mx: 1 }} />{" "}
              {/* Trường nhập số lượng */}
              <IconButton sx={{ color: "black" }}>+</IconButton>{" "}
              {/* Nút tăng số lượng */}
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

      {/* Phần dưới */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Books from the Same Category
        </Typography>
        {/* Thêm component hiển thị danh sách sách ở đây */}
      </Box>
    </Box>
  );
};

export default DetailPage;
