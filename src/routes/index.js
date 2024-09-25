import * as React from "react";
import { Routes, Route } from "react-router-dom";
import CartPage from "../pages/CartPage";
import DetailPage from "../pages/DetailPage";
import HelpCenter from "../pages/HelpCenter";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import OrderPage from "../pages/OrderPage";
import RegisterPage from "../pages/RegisterPage";
import UserProfilePage from "../pages/UserProfilePage";
import HomePage from "../pages/homePage";
import AdminPage from "../pages/adminPage";

import MainLayout from "../layouts/MainLayout";
function Router() {
  return (
    <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />}/>
      </Route>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route path="book/:bookId" element={<DetailPage />}/>
      <Route path="cart/:userId" element={<CartPage />}/>
      <Route path="order/:userId" element={<OrderPage />}/>
      <Route path="user/:userId" element={<UserProfilePage />}/>
      <Route path="/help" element={<HelpCenter />}/>
      <Route path="*" element={<NotFoundPage />}/>
      <Route path="admin/:userId" element={<AdminPage />}/>

    </Routes>
  );
}

export default Router;
