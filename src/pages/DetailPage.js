import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux"; 
import { getSingleBook, getBooks } from "../features/book/bookSlice"; 
import { toggleBookInWishlist } from "../features/wishlist/wishlistSlice"; 
import { Box, Typography, Button, IconButton, TextField } from "@mui/material"; 
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"; 
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import BookItem from "../features/book/bookItem"; 

const DetailPage = () => {
  const { bookId } = useParams(); 
  const dispatch = useDispatch();
  const { book, books } = useSelector((state) => {
    console.log("Redux state:", state.book);
    return state.book;
  });

  const { wishlist } = useSelector((state) => state.wishlist); 
  
  const [quantity, setQuantity] = useState(1); 

  useEffect(() => {
    const fetchBookData = async () => {
      await dispatch(getSingleBook(bookId));  
      console.log("Book fetched:", book);
      if (book?.category) {  
        dispatch(getBooks(1, "", "", "", book.category));  
      }
    };

    fetchBookData();
  }, [dispatch, bookId, book?.category]);

  // Hàm giảm số lượng
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Hàm tăng số lượng
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  // Thêm sách vào wishlist
  const handleAddToWishlist = () => {
    dispatch(toggleBookInWishlist(bookId)); 
  };

  // Kiểm tra xem sách có trong wishlist không
  const isBookInWishlist = wishlist.includes(bookId);

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
              Discount: {book.discountRate ? `${book.discountRate} %` : "0%"}
            </Typography>{" "}
            <Typography sx={{ m: 5 }} variant="h6">
              DiscountedPrice: ${book.discountedPrice} 
            </Typography>{" "}
            <Typography sx={{ m: 5 }} variant="body2">Publisher: {book.publisher}</Typography> 
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
              <IconButton sx={{ color: "black" }} onClick={handleDecrease}>
                <RemoveIcon />
              </IconButton>{" "}
              <TextField 
                value={quantity} 
                sx={{ width: "50px", mx: 1 }} 
                inputProps={{ readOnly: true }} 
              />{" "}
              <IconButton sx={{ color: "black" }} onClick={handleIncrease}>
                <AddIcon />
              </IconButton>{" "}
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
            <IconButton
              color="primary"
              onClick={handleAddToWishlist}
              sx={{
                color: isBookInWishlist ? "secondary.main"
                : "#0000FF", 
              }}
            >
              <FavoriteIcon />
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
