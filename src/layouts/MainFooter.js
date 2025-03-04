import React from "react";
import { Link, Typography, Box } from "@mui/material";

function MainFooter() {
  return (
    <Box sx={{ bgcolor: "primary.main", p: 0, m: 0 }}>
      <Box sx={{ bgcolor: "#B2EBF2", p: 0, m: 0, border: "none" }}>
        {" "}
        {/* Thêm padding và borderRadius */}
        <Typography
          variant="body1"
          color="inherit"
          align="center"
          sx={{ opacity: 0.8 }}
        >
          Chào mừng bạn đến với BookStore - nơi hội tụ những cuốn sách hay nhất
          dành cho mọi lứa tuổi. Chúng tôi cam kết mang đến cho bạn kho tàng
          kiến ​​thức đa dạng, từ những tác phẩm kinh điển đến những cuốn sách
          mới phát hành. Hãy để mỗi cuốn sách là một hành trình khám phá, nâng
          cao kiến ​​thức thú vị và trải nghiệm cuộc sống phong phú hơn.{" "}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="white"
        align="center"
        sx={{ textAlign: "center", p: 3 }}
      >
        {"Bùi Thạo © "}
        <Link color="inherit" href="">
          BookStore
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}

export default MainFooter;
