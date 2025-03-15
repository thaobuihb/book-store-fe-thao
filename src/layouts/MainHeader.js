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
import {loadCart} from "../features/cart/cartSlice"

function MainHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const categories = useSelector((state) => state.category.categories) || [];

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { logout } = useAuth();

  const cart = useSelector((state) => state.cart.cart);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const wishlistCount = wishlist.length;

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleLogout = () => {
    logout(wishlist, user, () => {
      dispatch(logoutSuccess());
      dispatch(clearWishlistOnLogout());
      navigate("/");
    });
  };

  return (
    <Box>
      <AppBar position="fixed" color="primary" sx={{ zIndex: 1200 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "80px",
          }}
        >
          {/* Logo */}
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <LogoB sx={{ width: 100, height: 100, mt: 4 }} />
          </IconButton>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h7"
              sx={{ cursor: "pointer", color: "#ffffff", mx: 2 }}
              onMouseEnter={(e) => setCategoryAnchorEl(e.currentTarget)}
            >
              Danh mục
            </Typography>
            <Menu
              anchorEl={categoryAnchorEl}
              open={Boolean(categoryAnchorEl)}
              onClose={() => setCategoryAnchorEl(null)}
              MenuListProps={{ onMouseLeave: () => setCategoryAnchorEl(null) }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category._id}
                  onClick={() => navigate(`/books?category=${category._id}`)}
                >
                  {category.categoryName}
                </MenuItem>
              ))}
            </Menu>

            <RouterLink
              to="/best-seller"
              style={{
                textDecoration: "none",
                color: "white",
                margin: "0 16px",
              }}
            >
              Sách bán chạy
            </RouterLink>
            <RouterLink
              to="/help"
              style={{
                textDecoration: "none",
                color: "white",
                margin: "0 16px",
              }}
            >
              Trung tâm hỗ trợ
            </RouterLink>
          </Box>

          {/* Search Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "500px !important",
              mx: 2,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          >
            <SearchInput
              handleSubmit={(query) =>
                navigate(`/books?search=${query.trim()}`)
              }
            />
          </Box>

          {/* User, Wishlist, Cart */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <RouterLink to="/wishlist">
              <IconButton color="inherit" sx={{ mr: 2 }}>
                <Badge badgeContent={wishlistCount} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </RouterLink>

            <IconButton
              id="cart-icon"
              color="inherit"
              sx={{ color: "blue", mr: 2 }}
              onClick={() =>
                navigate("/cart", { state: { activeTab: "yourCart" } })
              }
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>

            {!isAuthenticated ? (
              <Typography
                sx={{ color: "white", cursor: "pointer" }}
                onClick={() =>
                  navigate("/login", {
                    state: { from: window.location.pathname },
                  })
                }
              >
                Đăng nhập
              </Typography>
            ) : (
              <Box>
                <Typography
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ cursor: "pointer", color: "white" }}
                >
                  {user.name || "User"}
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => navigate(`/user/${user._id}`)}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
