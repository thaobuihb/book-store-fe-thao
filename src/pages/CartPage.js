import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  toggleCheckbox,
  orderCart,
  changeQuantity,
} from "../features/cart/cartSlice";
import LoadingScreen from "../components/LoadingScreen";
import { useParams } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Modal,
  TextField,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { toast } from "react-toastify";
import { getUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import CartItemDeleteModal from "../features/cart/CartItemDeleteModal";

function Cart() {
  const { cart, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [modalOpenDeleteItem, setModalOpenDeleteItem] = useState(false);
  const [iemDelete, setItemDelete] = useState([]);

  const handleDeleteItemClick = async (bookId, quantity, price) => {
    await setItemDelete([bookId, 1, price]);
    console.log(iemDelete);
    setModalOpenDeleteItem(true);
  };

  const handleCloseModalDeleteItem = () => {
    setModalOpenDeleteItem(false);
  };

  const handleConfirmDeleteItem = () => {
    console.log(iemDelete);
    dispatch(decreaseQuantity(userId, iemDelete[0], 1, iemDelete[2]));
    setModalOpenDeleteItem(false);
  };

  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    dispatch(getCart(userId));
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (bookId, quantity, price) => {
    dispatch(increaseQuantity(userId, bookId, quantity, price));
  };

  const handleDecreaseQuantity = (bookId, quantity, price) => {
    dispatch(decreaseQuantity(userId, bookId, quantity, price));
  };

  const handleChangQuantity = (bookId, quantity, price) => {
    dispatch(changeQuantity(userId, bookId, quantity, price));
  };

  const handleToggleCheckbox = (bookId) => {
    dispatch(toggleCheckbox(bookId));
  };
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  const handleModalOpen = () => {
    setModalOpen(true);
    const address = user.address || "";
    const city = user.city || "";
    const state = user.state || "";
    const zipcode = user.zipcode || "";
    setShippingAddress(`${address}, ${city}, ${state}, ${zipcode}`);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleOrder = () => {
    const checkedBooks = cart.filter((item) => item.checked);

    if (cart.length === 0) {
      toast.error(
        "Your cart is empty. Please add books to your cart before placing an order."
      );
    } else if (checkedBooks.length === 0) {
      toast.error("Please select at least one book to order.");
    } else {
      handleModalOpen();
    }
  };

  useEffect(() => {
    console.log(shippingAddress);
  }, [shippingAddress]);

  const handlePlaceOrder = async () => {
    const checkedBooks = cart.filter((item) => item.checked);
    if (!shippingAddress.trim()) {
      toast.error("Please enter a valid shipping address.");
      return;
    }

    if (cart.length === 0) {
      toast.error(
        "Your cart is empty. Please add books to your cart before placing an order."
      );
    } else if (checkedBooks.length === 0) {
      toast.error("Please select at least one book to order.");
    } else {
      await dispatch(orderCart(userId, checkedBooks, shippingAddress));
      console.log("haha");
      handleModalClose();
      await navigate(`/order/${user._id}`);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box sx={{ overflow: "auto", mt: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
          >
            Your Cart
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Book Name
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Price
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Quantity
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Amount
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.bookId}>
                  <TableCell>
                    <Checkbox
                      checked={item.checked}
                      onChange={() => handleToggleCheckbox(item.bookId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                    >
                      {item.bookName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                    >
                      ${item.price}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDecreaseQuantity(
                            item.bookId,
                            item.quantity,
                            item.price
                          )
                        }
                      >
                        <KeyboardArrowLeftIcon />
                      </IconButton>

                      <TextField
                        value={item.quantity}
                        InputProps={{
                          min: 1,
                          max: 9999,
                          sx: {
                            fontSize: isExtraSmallScreen ? "0.8rem" : "1rem",
                            width: 55,
                            input: { textAlign: "center" },
                          },
                        }}
                        onChange={(e) => {
                          const newQuantity = e.target.value;
                          handleChangQuantity(
                            item.bookId,
                            newQuantity,
                            item.price
                          );
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleIncreaseQuantity(
                            item.bookId,
                            item.quantity,
                            item.price
                          )
                        }
                      >
                        <KeyboardArrowRightIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                      onClick={() =>
                        handleDeleteItemClick(
                          item.bookId,
                          item.quantity,
                          item.price
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
              m: 5,
              fontSize: isExtraSmallScreen ? "0.8rem" : "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: 150 }}
              onClick={handleOrder}
            >
              Order
            </Button>
          </Box>
        </Box>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              width: "80%",
              maxWidth: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 0,
            }}
          >
            <Typography variant="h6" id="modal-title" gutterBottom>
              <Box sx={{ textAlign: "center" }}>
                <b> CHECK OUT</b>
              </Box>
            </Typography>
            <Typography gutterBottom>
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography gutterBottom>
              <strong>Checked Books:</strong>
            </Typography>
            {cart
              .filter((item) => item.checked)
              .map((book) => (
                <Typography key={book.bookId}>
                  <b>{book.bookName} </b>, <b> price:</b> {book.price} ,
                  <b> quantity:</b> {book.quantity}
                </Typography>
              ))}
            <Typography gutterBottom sx={{ mt: 1 }}>
              <strong>Shipping Address:</strong>
            </Typography>
            <TextField
              multiline
              rows={2}
              fullWidth
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
                sx={{ borderRadius: 0.5 }}
              >
                <b>Pay after recieve</b>
              </Button>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleModalClose}
              sx={{ mr: 2, borderRadius: 0.5 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <CartItemDeleteModal
        open={modalOpenDeleteItem}
        onClose={handleCloseModalDeleteItem}
        onConfirm={handleConfirmDeleteItem}
      />
    </div>
  );
}

export default Cart;
