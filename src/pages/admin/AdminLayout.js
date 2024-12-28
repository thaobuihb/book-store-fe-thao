import React from "react";
import { Box, Drawer, CssBaseline, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, Book, ShoppingCart, Group, Category } from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";

const drawerWidth = 240;

const AdminLayout = () => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/admin/dashboard" },
    { text: "Books", icon: <Book />, link: "/admin/books" },
    { text: "Orders", icon: <ShoppingCart />, link: "/admin/orders" },
    { text: "Users", icon: <Group />, link: "/admin/users" },
    { text: "Categories", icon: <Category />, link: "/admin/categories" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
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
