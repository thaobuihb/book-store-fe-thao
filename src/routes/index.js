import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Các trang chính
import CartPage from "../pages/CartPage";
import DetailPage from "../pages/DetailPage";
import HelpCenter from "../pages/HelpCenter";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import OrderPage from "../pages/OrderPage";
import RegisterPage from "../pages/RegisterPage";
import UserProfilePage from "../pages/UserProfilePage";
import Home from "../pages/HomePage";
import WishlistPage from "../pages/WishlistPage";
import BookPage from "../pages/BookPage";
import ThankYouPage from "../pages/ThankYouPage";
import BestSellerPage from "../pages/BestSellerPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// Layouts
import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";
import AdminLayout from "../pages/admin/AdminLayout";

// Các trang Admin
import DashboardPage from "../pages/admin/DashboardPage";
import BooksPage from "../pages/admin/BooksPage";
import OrdersPage from "../pages/admin/OrdersPage";
import UsersPage from "../pages/admin/UsersPage";
import CategoriesPage from "../pages/admin/CategoriesPage";

import AdminOnlyRoute from "./AdminOnlyRoute";
import useAuth from "../hooks/useAuth";

function Router() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Main Layout */}
      <Route
        element={
          user?.role === "admin" ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <MainLayout />
          )
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="book/:bookId" element={<DetailPage />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="order/:userId" element={<OrderPage />} />
        <Route path="user/:userId" element={<UserProfilePage />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="thank-you" element={<ThankYouPage />} />
        <Route path="/best-seller" element={<BestSellerPage />} />
      </Route>

      {/* Blank Layout */}
      <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Layout */}
      <Route element={<AdminOnlyRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/books" element={<BooksPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
