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
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  createGuestOrder,
  updateTransactionId,
} from "../features/order/orderSlice";
import { useTranslation } from "react-i18next";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { t } = useTranslation();

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

    // const savedOrder = localStorage.getItem("orderDetails");
    // if (savedOrder) {
    //   console.log("Dữ liệu từ localStorage:", JSON.parse(savedOrder));
    //   return JSON.parse(savedOrder);
    // }

    const savedOrder = sessionStorage.getItem("orderDetails");
    if (savedOrder) {
      console.log("Dữ liệu từ localStorage:", JSON.parse(savedOrder));
      return JSON.parse(savedOrder);
    }
    console.log("Không có dữ liệu trong state hoặc localStorage");
    return { items: [], totalAmount: 0 };
  });

  // Cập nhật `localStorage` khi `orderDetails` thay đổi
  // useEffect(() => {
  //   localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
  //   console.log("Order Details from localStorage or state:", orderDetails);
  // }, [orderDetails]);
  useEffect(() => {
    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    console.log("Order Details from localStorage or state:", orderDetails);
  }, [orderDetails]);

  // Dữ liệu biểu mẫu địa chỉ
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Việt Nam",
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
      setFormData((prevData) => ({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || prevData.country,
        city: user.city || "",
        district: user.district || "",
        ward: user.ward || "",
        street: user.street || "",
        houseNumber: user.houseNumber || "",
      }));
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
      console.error(t("order.formInvalid"), formData, errors);
      toast.error(t("order.formInvalid"));
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
        ward: formData.ward,
        zipcode: formData.zipcode || "",
        country: formData.country,
      },
      totalAmount: totalPayment,
      paymentMethods: paymentMethod,
    };

    // console.log("Dữ liệu gửi lên API:", orderData);

    try {
      let response;
      if (isAuthenticated) {
        response = await dispatch(
          createOrder({ userId: user._id, orderData })
        ).unwrap();
      } else {
        response = await dispatch(createGuestOrder(orderData)).unwrap();
      }

      // console.log("Đơn hàng đã được tạo thành công:", response);

      // Lấy `orderId` từ phản hồi
      const orderId = isAuthenticated ? response?._id : response?.orderCode;

      if (!orderId) {
        console.error(t("order.orderIdMissing"), response);
        toast.error(t("order.cannotViewOrder"));

        return;
      }

      // Chuyển hướng đến trang cảm ơn
      navigate("/thank-you", {
        state: {
          message: isAuthenticated
            ? t("order.successMessage")
            : t("order.guestSuccessMessage"),
          orderId,
        },
      });
    } catch (error) {
      console.error(t("order.placeOrderErrorLog"), error);
      toast.error(t("order.placeOrderErrorToast"));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {isLoading && (
        <Typography variant="h6">{t("order.processing")}</Typography>
      )}
      {error && (
        <Typography variant="h6" color="error">
          {t("order.error")}: {error}
        </Typography>
      )}

      <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Cột trái: Địa chỉ giao hàng */}
        <Grid item xs={12} md={6} sx={{ paddingRight: 5 }}>
          <Typography variant="h5" gutterBottom>
            {t("order.shippingAddress")}
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            {Object.keys(formData).map((field, index) => (
              <TextField
                key={index}
                label={t(`order.fields.${field}`)}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                error={!!errors[field]}
                helperText={errors[field] ? t("order.missingField") : ""}
              />
            ))}
          </Box>
        </Grid>

        {/* Cột phải: Thông tin đơn hàng */}
        <Grid item xs={12} md={6} sx={{ paddingLeft: 5 }}>
          <Typography variant="h5" gutterBottom>
            {t("order.reviewOrder")}
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
                  <Typography>
                    {t("order.quantity")}: {item.quantity}
                  </Typography>
                  <Typography>
                    {t("order.price")}: ${item.discountedPrice || item.price}
                  </Typography>
                  <Typography>
                    {t("order.totalForItem")}: $
                    {item.quantity * (item.discountedPrice || item.price)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          {/* Lựa chọn phương thức thanh toán */}
          <FormControl component="fieldset" sx={{ mt: 4 }}>
            <FormLabel component="legend">{t("order.paymentMethod")}</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="After receive"
                control={<Radio />}
                label={t("order.cod")}
              />
              <FormControlLabel
                value="PayPal"
                control={<Radio />}
                label={t("order.paypal")}
              />
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t("order.paymentDetails")}
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
                <strong>{t("order.subtotal")}:</strong> $
                {orderDetails.totalAmount.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>{t("order.shippingFee")}:</strong> $3.00
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                <strong>{t("order.total")}:</strong> ${totalPayment.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ maxWidth: 150, margin: "0 auto", overflow: "hidden" }}>
            {paymentMethod === "PayPal" ? (
              <PayPalButtons
                style={{
                  layout: "horizontal",
                  height: 40,
                  label: "paypal",
                  shape: "rect",
                }}
                forceReRender={[totalPayment]}
                createOrder={(data, actions) => {
                  if (!validateForm()) {
                    toast.error(t("order.fillAddressFirst"));
                    return;
                  }

                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalPayment.toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  const transactionId =
                    details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;

                  console.log("✅ TransactionId (capture ID):", transactionId);

                  console.log("📥 transactionId:", transactionId);
                  console.log("💰 Chi tiết giao dịch PayPal:", details);

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
                      ward: formData.ward,
                      zipcode: formData.zipcode || "",
                      country: formData.country,
                    },
                    totalAmount: totalPayment,
                    paymentMethods: "PayPal",
                  };

                  try {
                    // ✅ 1. Gửi tạo đơn hàng
                    const res = isAuthenticated
                      ? await dispatch(
                          createOrder({ userId: user._id, orderData })
                        ).unwrap()
                      : await dispatch(createGuestOrder(orderData)).unwrap();

                    // ✅ 2. Lấy orderId đúng theo loại người dùng
                    const orderId = isAuthenticated ? res._id : res.orderCode;

                    console.log("📦 Gửi cập nhật transactionId %%%", {
                      orderId: isAuthenticated ? res._id : res.orderCode,
                      transactionId,
                      isGuest: !isAuthenticated,
                    });
                    // ✅ 3. Cập nhật transactionId (đã sửa)
                    await dispatch(
                      updateTransactionId({
                        orderId,
                        transactionId,
                        isGuest: !isAuthenticated, // true nếu khách vãng lai
                      })
                    ).unwrap();

                    // ✅ 4. Điều hướng đến trang cảm ơn
                    navigate("/thank-you", {
                      state: {
                        message: t("order.paypalSuccess"),
                        orderId,
                      },
                    });
                  } catch (err) {
                    console.error(
                      "❌",
                      t("order.createOrderPaypalErrorLog"),
                      err
                    );
                    toast.error(t("order.createOrderPaypalErrorToast"));
                  }
                }}
                onError={(err) => {
                  console.error("❌ PayPal Error:", err);
                  toast.error(t("order.paypalError"));
                }}
              />
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handlePlaceOrder}
              >
                {t("order.placeOrder")}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderPage;
