import React from "react";
import { Box, Typography, Button, IconButton, TextField } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

function DetailPage() {
  return (
    <Box sx={{ padding: 4 }}>
      {/* Phần trên */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
        {/* Hình ảnh sách và mô tả */}
        <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Box component="img" src="/path-to-book-image.jpg" alt="Book Cover" sx={{ width: "100%", height: "auto" }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">Book Title</Typography>
            <Typography variant="body1">Author Name</Typography>
            <Typography variant="body2">Book Description</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Reviews</Typography>
              <Typography variant="body2">Rating: ★★★★☆</Typography>
              <Button variant="outlined" sx={{ mt: 1 }}>Write a Review</Button>
            </Box>
          </Box>
        </Box>

        {/* Thông tin sách và các nút thao tác */}
        <Box sx={{ width: "45%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">Price: $20.00</Typography>
            <Typography variant="body2">Publisher: XYZ</Typography>
            <Typography variant="body2">ISBN: 123-4567890123</Typography>
            <Typography variant="body2">Category: Fiction</Typography>
          </Box>

          {/* Các nút thao tác */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconButton>-</IconButton>
              <TextField value="1" sx={{ width: "50px", mx: 1 }} />
              <IconButton>+</IconButton>
            </Box>
            <Button variant="contained" startIcon={<ShoppingCartOutlinedIcon />} sx={{ mb: 1 }}>
              Add to Cart
            </Button>
            <Button variant="contained" color="secondary" sx={{ mb: 1 }}>
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
        <Typography variant="h5" sx={{ mb: 2 }}>Books from the Same Category</Typography>
        {/* Thêm component hiển thị danh sách sách ở đây */}
      </Box>
    </Box>
  );
}

export default DetailPage;
