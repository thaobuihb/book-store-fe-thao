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
import LogoB from "../components/LogoB";
import SearchInput from "../components/SearchInput";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { clearWishlistOnLogout } from "../features/wishlist/wishlistSlice";
import { logoutSuccess } from "../features/user/userSlice";

function MainHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { isAuthenticated, logout, user } = useAuth();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { logout } = useAuth();
  const cartItemCount = 3; 
  
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const wishlistCount = wishlist.length; 

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Gọi hàm logout và xử lý đăng xuất người dùng
    logout(wishlist, user, () => {
      dispatch(logoutSuccess());  // Cập nhật Redux với trạng thái isAuthenticated về false
      dispatch(clearWishlistOnLogout());  // Xóa wishlist trong Redux
      navigate("/", { replace: true });  // Điều hướng về trang chủ sau khi đăng xuất
    });
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/books?search=${query.trim()}`);
    }
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1, ml: 2, marginTop: 2 }}
          >
            <LogoB sx={{ width: 100, height: 100 }} />
          </IconButton>

          {/* Search Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              maxWidth: "400px",
              mx: 2,
              backgroundColor: "white",
              borderRadius: 1,
              marginRight: 80,
            }}
          >
            <SearchInput handleSubmit={handleSearch} />
          </Box>

          {/* User Menu, Wishlist, Cart */}
          <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
            {/* Wishlist */}
            <RouterLink to={"/wishlist"}>
              <IconButton size="large" color="inherit" aria-label="wishlist" sx={{ mr: 2 }}>
                <Badge badgeContent={wishlistCount} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </RouterLink>

            {/* Cart */}
            <RouterLink to={"/cart"}>
              <IconButton size="large" color="inherit" aria-label="cart" sx={{ mr: 2 }}>
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </RouterLink>

            {/* User Login/Logout */}
            {!isAuthenticated ? (
              <RouterLink to={"/login"} style={{ textDecoration: "none", color: "white", margin: '0 8px' }}>
                <Typography sx={{ color: "white", textDecoration: "none" }}>
                  Login
                </Typography>
              </RouterLink>
            ) : (
              <div>
                <Typography
                  onClick={handleMenu}
                  variant="h6"
                  sx={{
                    flexGrow: 1,
                    fontFamily: "Arial",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  {user.name || "User"}
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
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
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
          <RouterLink to={"/categories"} style={{ textDecoration: "none" }}>
            <Typography sx={{ mx: 3, color: "white", fontSize: "16px", fontWeight: "bold" }}>
              Shop by Category
            </Typography>
          </RouterLink>
          <RouterLink to={"/best-seller"} style={{ textDecoration: "none" }}>
            <Typography sx={{ mx: 3, color: "white", fontSize: "16px", fontWeight: "bold" }}>
              Best Seller
            </Typography>
          </RouterLink>
          <RouterLink to={"/help"} style={{ textDecoration: "none" }}>
            <Typography sx={{ mx: 3, color: "white", fontSize: "16px", fontWeight: "bold" }}>
              Contact Us
            </Typography>
          </RouterLink>
        </Box>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
