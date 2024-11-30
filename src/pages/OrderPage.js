import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin người dùng từ Redux
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Lấy thông tin order từ `localStorage` hoặc `location.state`
  const [orderDetails, setOrderDetails] = useState(() => {
    const savedOrder = localStorage.getItem("orderDetails");
    return savedOrder
      ? JSON.parse(savedOrder)
      : location.state || { items: [], totalAmount: 0 };
  });

  // Trạng thái lưu thông tin form
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

  // Tự động điền thông tin nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
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
  }, [isAuthenticated, user]);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "country",
      "city",
      "district",
      "ward",
      "street",
      "houseNumber",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }

    const orderData = {
      ...formData,
      items: orderDetails.items,
      totalAmount: orderDetails.totalAmount,
      paymentMethod,
    };

    // Điều hướng đến trang PayPal nếu chọn PayPal
    if (paymentMethod === "PayPal") {
      navigate("/paypal-payment", { state: { orderData } });
    } else {
      // Xóa `localStorage` sau khi đặt hàng thành công
      localStorage.removeItem("orderDetails");
      // Điều hướng đến trang cảm ơn
      navigate("/thank-you", {
        state: { message: "Đặt hàng thành công!", orderData },
      });
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Cột trái: Địa chỉ giao hàng */}
        <Grid item xs={12} md={6} sx={{ paddingRight: 5 }}>
          <Typography variant="h5" gutterBottom>
            Địa chỉ giao hàng
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            {Object.keys(formData).map((field, index) => (
              <TextField
                key={index}
                label={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                error={!!errors[field]}
                helperText={errors[field] ? "Vui lòng điền thông tin còn thiếu" : ""}
              />
            ))}
          </Box>
        </Grid>

        {/* Cột phải: Thông tin đơn hàng */}
        <Grid item xs={12} md={6} sx={{ paddingLeft: 5 }}>
          <Typography variant="h5" gutterBottom>
            Kiểm tra lại đơn hàng
          </Typography>
          <Box>
            {orderDetails.items.map((item, index) => (
              <Card key={index} sx={{ display: "flex", mb: 2 }}>
                <CardMedia
                  component="img"
                  image={item.img || "/default-book.jpg"}
                  alt={item.name}
                  sx={{ width: 100, height: 150 }}
                />
                <CardContent>
                  <Typography>{item.name}</Typography>
                  <Typography>Số lượng: {item.quantity}</Typography>
                  <Typography>Giá: ${item.price}</Typography>
                  <Typography>Tổng: ${item.quantity * item.price}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Typography variant="h6">Tổng tiền: ${orderDetails.totalAmount.toFixed(2)}</Typography>

          {/* Lựa chọn phương thức thanh toán */}
          <FormControl component="fieldset" sx={{ mt: 4 }}>
            <FormLabel component="legend">Phương thức thanh toán</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="COD"
                control={<Radio />}
                label="Thanh toán khi nhận hàng (COD)"
              />
              <FormControlLabel
                value="PayPal"
                control={<Radio />}
                label="Thanh toán qua PayPal"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button variant="contained" color="primary" size="large" onClick={handlePlaceOrder}>
              Đặt hàng
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderPage;
