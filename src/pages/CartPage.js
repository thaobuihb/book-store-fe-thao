import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadCart,
  updateCartQuantity,
  removeBookFromCart,
  clearAllCartItems,
} from "../features/cart/cartSlice";
import { fetchPurchaseHistory } from "../features/order/orderSlice";

import {
  selectCartItems,
  selectDetailedCart,
  selectCartReloadTrigger,
} from "../features/cart/selectors";
import { selectPurchaseHistory } from "../features/order/orderSelectors";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(0);

  const cart = useSelector(selectCartItems);
  const detailedCart = useSelector(selectDetailedCart);
  const cartReloadTrigger = useSelector(selectCartReloadTrigger);
  const purchaseHistory = useSelector(selectPurchaseHistory);
  // console.log("Purchase history from Redux:^^^^^^", purchaseHistory);
  // purchaseHistory.map((order) => {
  //   console.log("Books in order: ", order.books);
  // });

  // const cartReloadTrigger = useSelector((state) => state.cart.cartReloadTrigger);
  const { user } = useSelector((state) => state.user);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(loadCart());
    if (user?._id) {
      console.log("Fetching purchase history for user:#########", user._id);
      dispatch(fetchPurchaseHistory(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (cartReloadTrigger) {
      dispatch(loadCart());
    }
  }, [cartReloadTrigger, dispatch]);

  useEffect(() => {
    const allBookIds = cart.map((item) => item.bookId);
    setSelectedItems(allBookIds);
  }, [cart]);

  const cartItems = detailedCart.map((book) => {
    const cartItem = cart.find((item) => item.bookId === book._id);
    return cartItem ? { ...book, quantity: cartItem.quantity } : book;
  });

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.bookId))
    .reduce(
      (total, item) =>
        total + (item.discountedPrice || item.price) * item.quantity,
      0
    );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    const container = document.getElementById("cart-page-container");
    if (container) {
      container.focus();
    }
  };

  const handleUpdateQuantity = (bookId, quantity) => {
    if (quantity >= 0) {
      dispatch(updateCartQuantity({ bookId, quantity }));
    }
  };

  const handleRemoveItem = (bookId) => {
    dispatch(removeBookFromCart(bookId));
    setSelectedItems((prev) => prev.filter((id) => id !== bookId));
  };

  const handleClearCart = () => {
    dispatch(clearAllCartItems());
    setSelectedItems([]);
  };

  const handleProceedToCheckout = (useId) => {
    const selectedBooks = cartItems.filter((item) =>
      selectedItems.includes(item.bookId)
    );
    const totalAmount = selectedBooks.reduce(
      (total, item) =>
        total + (item.discountedPrice || item.price) * item.quantity,
      0
    );
    navigate(`/order/${useId}`, {
      state: { items: selectedBooks, totalAmount },
    });
  };

  const handleCheckboxChange = (bookId) => {
    setSelectedItems((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <Container id="cart-page-container" tabIndex="-1">
      <Typography variant="h4" gutterBottom>
        Shopping
      </Typography>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="Cart and Purchase History"
      >
        <Tab label="Your Cart" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Purchase History" id="tab-1" aria-controls="tabpanel-1" />
      </Tabs>

      <Box
        id="tabpanel-0"
        role="tabpanel"
        hidden={currentTab !== 0}
        aria-labelledby="tab-0"
      >
        {/* Nội dung của Your Cart */}
      </Box>
      <Box
        id="tabpanel-1"
        role="tabpanel"
        hidden={currentTab !== 1}
        aria-labelledby="tab-1"
      >
        {/* Nội dung của Purchase History */}
      </Box>

      {currentTab === 0 && (
        <>
          {cartItems.length === 0 ? (
            <Typography variant="h6">Your cart is empty</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  {cartItems.map((item, index) => (
                    <Grid item xs={12} key={`${item.bookId}-${index}`}>
                      <Card
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                        }}
                      >
                        <Checkbox
                          checked={selectedItems.includes(item.bookId)}
                          onChange={() => handleCheckboxChange(item.bookId)}
                        />
                        <CardMedia
                          component="img"
                          image={item.img || "/default-book.jpg"}
                          alt={item.name}
                          sx={{ width: 100, height: 150 }}
                        />
                        <Box sx={{ flex: 1, marginLeft: 2 }}>
                          <CardContent>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body1">
                              Price: ${item.discountedPrice || item.price}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 1,
                              }}
                            >
                              <IconButton
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.bookId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Remove />
                              </IconButton>
                              <Typography
                                variant="body1"
                                sx={{
                                  padding: "0 10px",
                                  minWidth: 30,
                                  textAlign: "center",
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.bookId,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Add />
                              </IconButton>
                            </Box>
                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                              Total: $
                              {(item.discountedPrice || item.price) *
                                item.quantity}
                            </Typography>
                          </CardContent>
                        </Box>
                        <IconButton
                          sx={{ color: "#FF0000" }}
                          onClick={() => handleRemoveItem(item.bookId)}
                        >
                          <Delete />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    padding: 3,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Total: ${totalPrice.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ marginTop: 2, width: "100%" }}
                    onClick={handleProceedToCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    Proceed to checkout
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: 2,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {currentTab === 1 && (
        <Box>
          {purchaseHistory.length === 0 ? (
            <Typography>You have no purchase history.</Typography>
          ) : (
            <Grid container spacing={2}>
              {purchaseHistory.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h8">
                        Order code: <strong>{order.orderCode}</strong>
                      </Typography>
                      <Typography>
                        Status: <strong>{order.status}</strong>{" "}
                      </Typography>
                      <Typography>
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography>
                        Total: ${order.totalAmount.toFixed(2)}
                      </Typography>
                      <Typography sx={{ mt: 2 }}>Books:</Typography>
                      {order.books.map((book, idx) => {
                        // console.log("Book data:******", book);
                        return (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: 1,
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={book.bookId?.img || "/default-book.jpg"}
                              alt={book.bookId.name}
                              sx={{ width: 50, height: 50, marginRight: 2 }}
                            />
                            <Box>
                              <Typography>{book.name}</Typography>
                              <Typography>
                                Price: ${book.price.toFixed(2)}
                              </Typography>
                              <Typography>Quantity: {book.quantity}</Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
