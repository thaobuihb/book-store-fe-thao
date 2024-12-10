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
import { useDispatch, useSelector } from "react-redux";
import { createOrder, createGuestOrder } from "../features/order/orderSlice";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Lấy trạng thái từ Redux
  const { isLoading = false, error = null } = useSelector(
    (state) => state.orders || {}
  );
  const { user, isAuthenticated } = useSelector((state) => state.user || {});

  // Lấy thông tin đơn hàng từ state hoặc localStorage
  const [orderDetails, setOrderDetails] = useState(() => {
    if (location.state && location.state.items) {
      console.log("Dữ liệu từ navigate:", location.state);
      return location.state;
    }

    const savedOrder = localStorage.getItem("orderDetails");
    if (savedOrder) {
      console.log("Dữ liệu từ localStorage:", JSON.parse(savedOrder));
      return JSON.parse(savedOrder);
    }

    console.log("Không có dữ liệu trong state hoặc localStorage");
    return { items: [], totalAmount: 0 };
  });

  // Cập nhật `localStorage` khi `orderDetails` thay đổi
  useEffect(() => {
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    console.log("Order Details from localStorage or state:", orderDetails);
  }, [orderDetails]);

  // Dữ liệu biểu mẫu địa chỉ
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

  // Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("After receive");
  const [errors, setErrors] = useState({});

  // Tính toán chi phí vận chuyển và tổng thanh toán
  const shippingFee = 3.0; 
  const totalPayment = orderDetails.totalAmount + shippingFee;

  // Điền thông tin người dùng nếu đã đăng nhập
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

  // Cập nhật dữ liệu biểu mẫu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  // Xác minh biểu mẫu
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

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      console.error("Form không hợp lệ:", formData, errors);
      return;
    }

    const orderData = {
      books: orderDetails.items.map((item) => ({
        bookId: item._id,
        quantity: item.quantity || 1,
      })),
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        addressLine: `${formData.houseNumber}, ${formData.street}`,
        city: formData.city,
        state: formData.district,
        zipcode: formData.ward,
        country: formData.country,
      },
      totalAmount: totalPayment,
      paymentMethods: paymentMethod,
    };

    console.log("Dữ liệu gửi lên API:", orderData);

    try {
      let response;
      if (isAuthenticated) {
        response = await dispatch(
          createOrder({ userId: user._id, orderData })
        ).unwrap();
      } else {
        response = await dispatch(createGuestOrder(orderData)).unwrap();
      }

      console.log("Đơn hàng đã được tạo thành công:", response);

      // Chuyển hướng đến trang cảm ơn
      navigate("/thank-you", {
        state: { message: "Đặt hàng thành công!", orderData: response },
      });
    } catch (error) {
      console.error("Lỗi khi thực hiện đặt hàng:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {isLoading && <Typography variant="h6">Đang xử lý...</Typography>}
      {error && (
        <Typography variant="h6" color="error">
          Lỗi: {error}
        </Typography>
      )}

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
                helperText={
                  errors[field] ? "Vui lòng điền thông tin còn thiếu" : ""
                }
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
                  <Typography>
                    Giá: ${item.discountedPrice || item.price}
                  </Typography>
                  <Typography>
                    Tổng: $
                    {item.quantity * (item.discountedPrice || item.price)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          {/* Lựa chọn phương thức thanh toán */}
          <FormControl component="fieldset" sx={{ mt: 4 }}>
            <FormLabel component="legend">Phương thức thanh toán</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="After receive"
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
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Chi tiết thanh toán
            </Typography>
            <Box
              sx={{
                mt: 2,
                padding: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">
                <strong>Tổng tiền hàng:</strong> $
                {orderDetails.totalAmount.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Phí vận chuyển:</strong> $3.00
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                <strong>Tổng thanh toán:</strong> $
                {totalPayment.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePlaceOrder}
            >
              Đặt hàng
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderPage;
