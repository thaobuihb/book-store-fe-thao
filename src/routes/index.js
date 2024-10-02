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
import WishlistPage from "../pages/WishlistPage";
import BookPage from "../pages/BookPage"

import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";

function Router() {
  return (
    <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />}/>
      <Route path="book/:bookId" element={<DetailPage />}/>
      <Route path="/books" element={<BookPage/>}/>
      <Route path="cart/:userId" element={<CartPage />}/>
      <Route path="order/:userId" element={<OrderPage />}/>
      <Route path="user/:userId" element={<UserProfilePage />}/>
      <Route path="/help" element={<HelpCenter />}/>
      <Route path="admin/:userId" element={<AdminPage />}/>
      <Route path="wishlist/:userId" element={<WishlistPage />}/>
      </Route>

     <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
