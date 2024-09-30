import React from "react";
import { Link, Typography, Box } from "@mui/material";

function MainFooter() {
  return (
    <Box sx={{ bgcolor: "primary.main", p: 0  , m: 0 }}>
      <Box sx={{ bgcolor: "#B2EBF2", p: 0, m: 0, border: 'none'  }}> {/* Thêm padding và borderRadius */}
        <Typography
          variant="body1"
          color="inherit"
                    align="center"
          sx={{ opacity: 0.8 }}
        >
          Welcome to BookStore - where the best books for all ages converge. We
          are committed to bringing you a diverse treasure of knowledge, from
          classic works to newly released books. Let each book be an exciting
          journey of discovery, improving knowledge and experiencing a richer
          life.{" "}
        </Typography>
      </Box>
      <Typography variant="body2" color="white" align="center" sx={{ textAlign: 'center', p: 3}}>
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
