import React, { useMemo } from "react";
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { Dashboard, Book, ShoppingCart, Group, Category, Logout } from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout(null, null, () => {
      navigate("/login");
    });
  };

  const menuItems = [
    { text: t("admin.menu.dashboard"), icon: <Dashboard />, link: "/admin/dashboard" },
    { text: t("admin.menu.books"), icon: <Book />, link: "/admin/books" },
    { text: t("admin.menu.orders"), icon: <ShoppingCart />, link: "/admin/orders" },
    { text: t("admin.menu.users"), icon: <Group />, link: "/admin/users" },
    { text: t("admin.menu.categories"), icon: <Category />, link: "/admin/categories" },
  ];

  const pageTitle = useMemo(() => {
    const currentItem = menuItems.find((item) => location.pathname.includes(item.link));
    return currentItem ? currentItem.text : "Admin";
  }, [location.pathname, menuItems]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap>
            {pageTitle} 
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
             {t("admin.logout")}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.link}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
