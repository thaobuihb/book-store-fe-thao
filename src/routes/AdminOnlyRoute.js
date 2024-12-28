import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminOnlyRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // Nếu chưa đăng nhập, điều hướng về trang login
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    // Nếu không phải admin, điều hướng về trang không có quyền truy cập
    return <Navigate to="/unauthorized" />;
  }

  // Nếu là admin, hiển thị nội dung bên trong
  return <Outlet />;
};

export default AdminOnlyRoute;
