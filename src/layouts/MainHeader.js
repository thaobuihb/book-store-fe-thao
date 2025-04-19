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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
import { useTranslation } from "react-i18next";

function MainHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = useSelector((state) => state.category.categories) || [];
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const openLangMenu = Boolean(langAnchorEl);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout(wishlist, user, () => {
      dispatch(logoutSuccess());
      dispatch(clearWishlistOnLogout());
      navigate("/");
    });
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const drawer = (
    <Box sx={{ width: 240 }} onClick={handleDrawerToggle}>
      <Typography variant="h6" sx={{ m: 2 }}>
        {t("menu")}
      </Typography>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate("/best-seller")}>
          <ListItemText primary={t("bestSeller")} />
        </ListItem>
        <ListItem button onClick={() => navigate("/help")}>
          <ListItemText primary={t("helpCenter")} />
        </ListItem>
        {categories.map((cat) => (
          <ListItem
            button
            key={cat._id}
            onClick={() => navigate(`/books?category=${cat._id}`)}
          >
            <ListItemText primary={cat.categoryName} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      <AppBar position="fixed" color="primary" sx={{ zIndex: 1200 }}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          {/* Mobile: Hamburger menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <IconButton color="inherit">
            <LogoB sx={{ width: 60, height: 60 }} />
          </IconButton>

          {/* Desktop: menu links */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ cursor: "pointer", color: "#ffffff", mx: 2 }}
              onMouseEnter={(e) => setCategoryAnchorEl(e.currentTarget)}
            >
              {t("category")}
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
              style={{ textDecoration: "none", color: "white", margin: "0 16px" }}
            >
              {t("bestSeller")}
            </RouterLink>
            <RouterLink
              to="/help"
              style={{ textDecoration: "none", color: "white", margin: "0 16px" }}
            >
              {t("helpCenter")}
            </RouterLink>
          </Box>

          {/* Search (desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              width: 300,
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

          {/* Icons: wishlist, cart, login/user (visible on all screens) */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Wishlist */}
            <RouterLink to="/wishlist">
              <IconButton color="inherit" sx={{ mx: 0.5 }}>
                <Badge badgeContent={wishlistCount} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </RouterLink>

            {/* Cart */}
            <IconButton
              id="cart-icon"
              color="inherit"
              sx={{ mx: 0.5 }}
              onClick={() =>
                navigate("/cart", { state: { activeTab: "yourCart" } })
              }
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Language (desktop only) */}
            <Typography
              onClick={(e) => setLangAnchorEl(e.currentTarget)}
              sx={{ color: "white", cursor: "pointer", mx: 0.5, display: { xs: "none", sm: "inline" } }}
            >
              {t("language")}
            </Typography>
            <Menu
              anchorEl={langAnchorEl}
              open={openLangMenu}
              onClose={() => setLangAnchorEl(null)}
            >
              <MenuItem onClick={() => { changeLanguage("vi"); setLangAnchorEl(null); }}>
                🇻🇳 Tiếng Việt
              </MenuItem>
              <MenuItem onClick={() => { changeLanguage("en"); setLangAnchorEl(null); }}>
                🇬🇧 English
              </MenuItem>
            </Menu>

            {/* User / Login */}
            {!isAuthenticated ? (
              <Typography
                sx={{ color: "white", cursor: "pointer", mx: 0.5 }}
                onClick={() =>
                  navigate("/login", {
                    state: { from: window.location.pathname },
                  })
                }
              >
                {t("login")}
              </Typography>
            ) : (
              <Box>
                <Typography
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ cursor: "pointer", color: "white", mx: 0.5 }}
                >
                  {user.name || "User"}
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      navigate(`/user/${user._id}`);
                    }}
                  >
                    {t("profile")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      handleLogout();
                    }}
                  >
                    {t("logout")}
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default MainHeader;
