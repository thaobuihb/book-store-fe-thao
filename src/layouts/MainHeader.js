import React, { useState, useEffect } from "react";
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
import { getCategories } from "../features/category/categorySlice";

function MainHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const categories = useSelector((state) => state.category.categories);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { logout } = useAuth();

  const cart = useSelector((state) => state.cart.cart);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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
    logout(wishlist, user, () => {
      dispatch(logoutSuccess());
      dispatch(clearWishlistOnLogout());
      navigate("/", { replace: true });
    });
  };

  const handleProfileClick = () => {
    setAnchorEl(null); 
    navigate(`/user/${user._id}`); 
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/books?search=${query.trim()}`);
    }
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCategoryMenuOpen = (event) => {
    setCategoryAnchorEl(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null);
  };

  const handleCategoryClick = (categoryId) => {
    handleCategoryMenuClose();
    navigate(`/books?category=${categoryId}`);
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
              <IconButton
                size="large"
                color="inherit"
                aria-label="wishlist"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={wishlistCount} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </RouterLink>

            {/* Cart */}
            <RouterLink to={"/cart"}>
              <IconButton
                size="large"
                color="inherit"
                aria-label="cart"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={cartItemCount} color="secondary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </RouterLink>

            {/* User Login/Logout */}
            {!isAuthenticated ? (
              <Typography
              sx={{ color: "white", textDecoration: "none", cursor: "pointer", margin: "0 8px" }}
              onClick={() => navigate("/login", { state: { from: window.location.pathname } })}
            >
              Login
            </Typography>
            
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
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
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
          <Typography
            variant="h6"
            sx={{ cursor: "pointer", color: "#ffffff" }}
            onMouseEnter={handleCategoryMenuOpen}
          >
            Shop by Category
          </Typography>

          <Menu
            anchorEl={categoryAnchorEl}
            open={Boolean(categoryAnchorEl)}
            onClose={handleCategoryMenuClose}
            onMouseLeave={handleCategoryMenuClose}
            MenuListProps={{ onMouseLeave: handleCategoryMenuClose }}
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {category.categoryName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No categories available</MenuItem>
            )}
          </Menu>

          <RouterLink to={"/best-seller"} style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                mx: 3,
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Best Seller
            </Typography>
          </RouterLink>
          <RouterLink to={"/help"} style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                mx: 3,
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
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
