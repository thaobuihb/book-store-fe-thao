import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Link,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { loadCart } from "../features/cart/cartSlice";

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  // Kiểm tra state truyền từ location
  const locationState = location.state;

  // Nếu không có state từ location, đọc từ localStorage
  const [orderDetails, setOrderDetails] = useState(() => {
    const savedOrder = localStorage.getItem("buyNowOrder");
    return savedOrder ? JSON.parse(savedOrder) : { items: [], totalAmount: 0 };
  });

  // Nếu có state từ location, cập nhật lại orderDetails
  useEffect(() => {
    if (locationState?.items) {
      setOrderDetails({
        items: locationState.items,
        totalAmount: locationState.totalAmount,
      });
    }
  }, [locationState]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    houseNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
        district: user.district || "",
        ward: user.ward || "",
        street: user.street || "",
        houseNumber: user.houseNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handlePlaceOrder = () => {
    const orderData = {
      ...formData,
      items: orderDetails.items,
      totalAmount: orderDetails.totalAmount,
    };
    console.log("Placing order with data:", orderData);
    // Gọi API để lưu dữ liệu đặt hàng
  };

  return (
    <Box sx={{ padding: 4 }}>
      {!isAuthenticated && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Bạn đã là thành viên?{" "}
            <Link
              component="button"
              variant="body1"
              onClick={handleLoginRedirect}
              sx={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      )}

      <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Cột trái: Địa chỉ giao hàng */}
        <Grid item xs={12} md={6} sx={{ paddingRight: 5, paddingLeft: 15 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Địa chỉ giao hàng
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Họ và tên người nhận"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Quốc gia"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Tỉnh/Thành Phố"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Quận/Huyện"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Phường/Xã"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Đường"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Số nhà"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
          </Box>
        </Grid>

        {/* Cột phải: Thông tin về đơn hàng */}
        <Grid item xs={12} md={6} sx={{ paddingLeft: 5, paddingRight: 15 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Kiểm tra lại đơn hàng
          </Typography>
          <Box>
            {orderDetails.items.map((item, index) => (
              <Card key={index} sx={{ display: "flex", mb: 2 }}>
                <CardMedia
                  component="img"
                  image={item.img ? item.img : "/default-book.jpg"}
                  alt={item.name}
                  sx={{ width: 100, height: 150 }}
                />
                <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">
                    Giá: ${item.discountedPrice || item.price}
                  </Typography>
                  <Typography variant="body2">Số lượng: {item.quantity}</Typography>
                  <Typography variant="body2">
                    Tổng: ${(item.discountedPrice || item.price) * item.quantity}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mt: 3 }}>
            Tổng tiền: ${orderDetails.totalAmount.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            onClick={handlePlaceOrder}
          >
            Đặt hàng
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderPage;
