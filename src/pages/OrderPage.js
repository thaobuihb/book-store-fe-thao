import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
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
import ShippingForm from "../features/order/ShippingForm";
import OrderItem from "../features/order/OrderItem";
import OrderSummary from "../features/order/OrderSummary";  

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { isLoading = false, error = null } = useSelector(
    (state) => state.orders || {}
  );
  const { user, isAuthenticated } = useSelector((state) => state.user || {});

  const [orderDetails, setOrderDetails] = useState(() => {
    const savedOrder =
      location.state?.items ||
      JSON.parse(sessionStorage.getItem("orderDetails")) ||
      { items: [], totalAmount: 0 };
    return location.state || savedOrder;
  });

  useEffect(() => {
    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));
  }, [orderDetails]);

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

  const [paymentMethod, setPaymentMethod] = useState("After receive");
  const [errors, setErrors] = useState({});

  const shippingFee = 3.0;
  const totalPayment = orderDetails.totalAmount + shippingFee;

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || prev.country,
        city: user.city || "",
        district: user.district || "",
        ward: user.ward || "",
        street: user.street || "",
        houseNumber: user.houseNumber || "",
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const required = [
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
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildOrderData = (method = paymentMethod) => {
    const baseData = {
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
      paymentMethods: method,
    };
  
    if (!isAuthenticated) {
      baseData.guestEmail = formData.email;
    }
  
    return baseData;
  };
  

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error(t("order.formInvalid"));
      return;
    }

    try {
      const orderData = buildOrderData();
      const res = isAuthenticated
        ? await dispatch(createOrder({ userId: user._id, orderData })).unwrap()
        : await dispatch(createGuestOrder(orderData)).unwrap();

      const orderId = isAuthenticated ? res?._id : res?.orderCode;
      if (!orderId) throw new Error("Missing order ID");

      navigate("/thank-you", {
        state: {
          message: isAuthenticated
            ? t("order.successMessage")
            : t("order.guestSuccessMessage"),
          orderId,
        },
      });
    } catch (err) {
      toast.error(t("order.placeOrderErrorToast"));
    }
  };

  const handlePayPalSuccess = async (details, actions) => {
    const transactionId =
      details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const orderData = buildOrderData("PayPal");

    try {
      const res = isAuthenticated
        ? await dispatch(createOrder({ userId: user._id, orderData })).unwrap()
        : await dispatch(createGuestOrder(orderData)).unwrap();

      const orderId = isAuthenticated ? res._id : res.orderCode;

      await dispatch(
        updateTransactionId({ orderId, transactionId, isGuest: !isAuthenticated })
      ).unwrap();

      navigate("/thank-you", {
        state: {
          message: t("order.paypalSuccess"),
          orderId,
        },
      });
    } catch (err) {
      toast.error(t("order.createOrderPaypalErrorToast"));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {isLoading && <Typography>{t("order.processing")}</Typography>}
      {error && <Typography color="error">{t("order.error")}: {error}</Typography>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            {t("order.shippingAddress")}
          </Typography>
          <ShippingForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            t={t}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            {t("order.reviewOrder")}
          </Typography>

          {orderDetails.items.map((item, index) => (
            <OrderItem key={index} item={item} t={t} />
          ))}

          <FormControl component="fieldset" sx={{ mt: 4 }}>
            <FormLabel>{t("order.paymentMethod")}</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="After receive" control={<Radio />} label={t("order.cod")} />
              <FormControlLabel value="PayPal" control={<Radio />} label={t("order.paypal")} />
            </RadioGroup>
          </FormControl>

          <OrderSummary
            subtotal={orderDetails.totalAmount}
            shippingFee={shippingFee}
            total={totalPayment}
            t={t}
          />

          <Box sx={{ maxWidth: 150, mx: "auto", mt: 3 }}>
            {paymentMethod === "PayPal" ? (
              <PayPalButtons
                style={{ layout: "horizontal", height: 40, label: "paypal", shape: "rect" }}
                forceReRender={[totalPayment]}
                createOrder={(data, actions) => {
                  if (!validateForm()) {
                    toast.error(t("order.fillAddressFirst"));
                    return;
                  }
                  return actions.order.create({
                    purchase_units: [{ amount: { value: totalPayment.toFixed(2) } }],
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  handlePayPalSuccess(details, actions);
                }}
                onError={(err) => {
                  toast.error(t("order.paypalError"));
                }}
              />
            ) : (
              <Button variant="contained" color="primary" size="large" onClick={handlePlaceOrder}>
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
