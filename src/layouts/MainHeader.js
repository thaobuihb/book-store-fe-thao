import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Link,
  Menu,
  MenuItem,
} from "@mui/material";
import Logo from "../components/Logo";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person"; // Import the person icon
import SearchInput from "../components/SearchInput";

const handleSearch = (query) => {
  console.log("Search query:", query);
  // Logic xử lý tìm kiếm
};

function MainHeader() {
  const isAuthenticated = false; // Thiết lập là false để mô phỏng trạng thái chưa đăng nhập
  const cartItemCount = 3; 

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="static" color="primary"> 
        <Toolbar sx={{ justifyContent: "center", alignItems: "center" }}>
          {/* Logo */}
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Logo />
          </IconButton>

          {/* Search Box */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: '400px', mx: 2 }}>
            <SearchInput handleSubmit={handleSearch} />
          </Box>

          {/* User Menu, Wishlist, Cart */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mx: 2 }}>
            {/* Wishlist */}
            <IconButton size="large" edge="start" color="inherit" aria-label="wishlist" sx={{ mr: 2 }}>
              <FavoriteBorderIcon />
            </IconButton>

            {/* Cart */}
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>

            {/* User Account */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <PersonIcon />
              <Typography variant="h6" sx={{ mx: 1 }}>

              </Typography>

              {!isAuthenticated ? (
                <>
                  <Link component="a" href="/login" sx={{ textDecoration: "none", color: "white", mx: 1 }}>
                    Login
                  </Link>
                  <Link component="a" href="/register" sx={{ textDecoration: "none", color: "white" }}>
                    Register
                  </Link>
                </>
              ) : (
                <div>
                  <Typography
                    onClick={handleMenu}
                    variant="h6"
                    component="div"
                    sx={{
                      flexGrow: 1,
                      fontFamily: "Arial",
                      fontSize: "16px",
                      fontWeight: "bold",
                      "&:hover": {
                        opacity: 0.8,
                        cursor: "pointer",
                      },
                      color: "white" 
                    }}
                  >
                    User Name
                  </Typography>

                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx={{ mr: 0 }}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>Log out</MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </Box>
        </Toolbar>
        
        {/* Navigation Links */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1 }}>
          <Link component="a" href="#" sx={{ mx: 2, fontSize: '16px', fontWeight: 'bold', color: 'white' }}> 
            Shop by Category
          </Link>
          <Link component="a" href="#" sx={{ mx: 2, fontSize: '16px', fontWeight: 'bold', color: 'white' }}> 
            Best Seller
          </Link>
          <Link component="a" href="#" sx={{ mx: 2, fontSize: '16px', fontWeight: 'bold', color: 'white' }}> 
            Contact Us
          </Link>
        </Box>
      </AppBar>
    </Box>
  );
}

export default MainHeader;