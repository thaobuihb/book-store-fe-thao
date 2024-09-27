import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person"; // Import the person icon
import LogoB from "../components/LogoB";
import SearchInput from "../components/SearchInput";
import { Link as RouterLink } from "react-router-dom";

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
          {/* LogoB */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <LogoB sx={{ width: 80, height: 80 }} />
          </IconButton>

          {/* Search Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              maxWidth: "400px",
              mx: 2,
            }}
          >
            <SearchInput handleSubmit={handleSearch} />
          </Box>

          {/* User Menu, Wishlist, Cart */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: 2,
            }}
          >
            {/* Wishlist */}
            <RouterLink to={"/wishlist/:userId"}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="wishlist"
                sx={{ mr: 2 }}
              >
                <FavoriteBorderIcon />
              </IconButton>
            </RouterLink>
            {/* Cart */}
            <RouterLink to={"/cart/:userId"}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </RouterLink>

            {/* User Account */}
            <RouterLink
              to={"/admin/:userId"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <PersonIcon />
              </IconButton>
            </RouterLink>
            {!isAuthenticated ? (
              <>
                <RouterLink
                  to={"/login"}
                  sx={{ textDecoration: "none", color: "white", mx: 1 }}
                >
                  Login
                </RouterLink>
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
                    color: "white",
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
          </Box>
        </Toolbar>

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mt: 1,
          }}
        >
          <RouterLink to={"#"}>
            <Typography
              sx={{
                mx: 5,
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Shop by Category
            </Typography>
          </RouterLink>
          <RouterLink to={"#"}>
            <Typography
              sx={{
                mx: 5,
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Best Seller
            </Typography>
          </RouterLink>
          <RouterLink to={"/help"}>
            <Typography
              sx={{
                mx: 5,
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Contact Us
            </Typography>
          </RouterLink>
        </Box>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
