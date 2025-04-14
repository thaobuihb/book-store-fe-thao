import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrderDetails,
  fetchGuestOrderDetails,
  selectOrderDetails,
} from "../features/order/orderSlice";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const dispatch = useDispatch();
  const orderDetails = useSelector(selectOrderDetails);
  const { isAuthenticated, user } = useAuth();
  const { isLoading, error } = useSelector((state) => state.order);
  const { t } = useTranslation();

  // Fetch order details based on authentication status
  useEffect(() => {
    if (!orderId) {
      toast.error("Order ID is missing!");
      navigate("/");
      return;
    }

    if (isAuthenticated) {
      // Trường hợp người dùng đã đăng nhập
      dispatch(fetchOrderDetails({ userId: user?._id, orderId }))
        .unwrap()
        .then((details) => {
          console.log("Fetched order details for authenticated user:", details);
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
          toast.error("Unable to fetch order details!");
          navigate("/");
        });
    } else {
      // Trường hợp người dùng chưa đăng nhập
      dispatch(fetchGuestOrderDetails(orderId))
        .unwrap()
        .then((details) => {
          console.log("Fetched guest order details:", details);
        })
        .catch((error) => {
          console.error("Error fetching guest order details:", error);
          toast.error("Order not found!");
          navigate("/");
        });
    }
  }, [orderId, isAuthenticated, user?._id, dispatch, navigate]);

  useEffect(() => {
    console.log("Order ID in ThankYouPage:", orderId);
    console.log("Order Details in State:", orderDetails);
  }, [orderDetails]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "orange",
          fontStyle: "italic",
        }}
      >
        {t("thankYou.title")}{" "}
      </Typography>
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : error ? (
        <Typography color="error" variant="body1">
          {t("thankYou.error")}
        </Typography>
      ) : orderDetails ? (
        <>
          <Typography
            variant="h6"
            sx={{ textTransform: "uppercase", fontWeight: "bold" }}
          >
            {t("thankYou.orderInfo")}
          </Typography>
          <Typography>
            <strong>
              {t("thankYou.orderCode")}: {orderDetails.orderCode}
            </strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>
              {t("thankYou.shippingFee")}: ${orderDetails.shippingFee || 3.0}
            </strong>
          </Typography>
          <Typography>
            <strong>
              <strong>
                {t("thankYou.totalAmount")}: $
                {orderDetails.totalAmount.toFixed(2)}
              </strong>
            </strong>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            {t("thankYou.booksOrdered")}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              maxWidth: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {orderDetails.books?.length > 0 ? (
              orderDetails.books.map((book, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 2,
                      height: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        book.bookId?.img || book.img || "/default-book.jpg"
                      }
                      alt={book.bookId?.name || book.name || "Book"}
                      sx={{
                        height: 140,
                        width: "auto",
                        objectFit: "contain",
                        marginBottom: 2,
                      }}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" align="center">
                        {book.name || "Unknown Book"}
                      </Typography>
                      <Typography align="center">
                        {t("thankYou.quantity")}: {book.quantity || 0}
                      </Typography>
                      <Typography align="center">
                        {t("thankYou.price")}: $
                        {book.price?.toFixed(2) || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>{t("thankYou.noBooks")}</Typography>
            )}
          </Grid>
          <Box sx={{ marginTop: 4 }}>
            <Tooltip title="Return to Home Page">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/")}
              >
                <Typography>{t("thankYou.keepBuying")}</Typography>
              </Button>
            </Tooltip>
          </Box>
        </>
      ) : (
        <Typography>{t("thankYou.notFound")}</Typography>
      )}
    </Box>
  );
};

export default ThankYouPage;
