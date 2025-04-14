import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadCart,
  updateCartQuantity,
  removeBookFromCart,
  clearAllCartItems,
} from "../features/cart/cartSlice";
import {
  fetchPurchaseHistory,
  cancelOrder,
  searchOrderByCode,
  clearSearchResult,
  cancelGuestOrder,
} from "../features/order/orderSlice";
import {
  selectCartItems,
  selectDetailedCart,
  selectCartReloadTrigger,
} from "../features/cart/selectors";
import { selectPurchaseHistory } from "../features/order/orderSelectors";

import CartTabs from "../features/cart/CartTabs";
import CartList from "../features/cart/CartList";
import CartSummary from "../features/cart/CartSummary";
import OrderSearch from "../features/order/OrderSearch";
import OrderList from "../features/order/OrderList";
import CancelOrderDialog from "../features/order/CancelOrderDialog";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const cart = useSelector(selectCartItems);
  const detailedCart = useSelector(selectDetailedCart);
  const cartReloadTrigger = useSelector(selectCartReloadTrigger);
  const purchaseHistory = useSelector(selectPurchaseHistory);
  const user = useSelector((state) => state.user?.user || null);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);
  const { searchResult, searchError } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(loadCart());
    if (user?._id) dispatch(fetchPurchaseHistory(user._id));
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(loadCart());
      dispatch(fetchPurchaseHistory(user._id));
    }
  }, [isAuthenticated, user?._id, dispatch]);

  useEffect(() => {
    if (cartReloadTrigger) dispatch(loadCart());
  }, [cartReloadTrigger, dispatch]);

  useEffect(() => {
    const allBookIds = cart.map((item) => item.bookId);
    setSelectedItems(allBookIds);
  }, [cart]);

  useEffect(() => {
    if (!isAuthenticated) setSearchQuery("");
  }, [isAuthenticated]);

  const cartItems = detailedCart.map((book) => {
    const cartItem = cart.find((item) => item.bookId === book._id);
    return cartItem ? { ...book, quantity: cartItem.quantity } : book;
  });

  const totalPrice = (
    Math.round(
      cartItems
        .filter((item) => selectedItems.includes(item.bookId))
        .reduce(
          (total, item) =>
            total + Number(item.discountedPrice || item.price) * Number(item.quantity),
          0
        ) * 100
    ) / 100
  ).toFixed(2); 
  
  
  
  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
    document.getElementById("cart-page-container")?.focus();
  };

  const handleUpdateQuantity = (bookId, quantity) => {
    if (quantity >= 0) dispatch(updateCartQuantity({ bookId, quantity }));
  };

  const handleRemoveItem = (bookId) => {
    dispatch(removeBookFromCart(bookId));
    setSelectedItems((prev) => prev.filter((id) => id !== bookId));
  };

  const handleClearCart = () => {
    dispatch(clearAllCartItems());
    setSelectedItems([]);
  };

  const handleProceedToCheckout = () => {
    const selectedBooks = cartItems.filter((item) => selectedItems.includes(item.bookId));
    const totalAmount = selectedBooks.reduce((total, item) => total + (item.discountedPrice || item.price) * item.quantity, 0);
    navigate(`/order/${user?._id}`, { state: { items: selectedBooks, totalAmount } });
  };

  const handleCheckboxChange = (bookId) => {
    setSelectedItems((prev) => prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return alert("Vui lòng nhập mã đơn hàng!");
    dispatch(searchOrderByCode(searchQuery));
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(clearSearchResult());
  };

  const handleOpenModal = (orderIdOrCode) => {
    setSelectedOrderId(orderIdOrCode);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrderId(null);
  };

  const handleConfirmCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      if (user?._id) {
        await dispatch(cancelOrder({ userId: user._id, orderId: selectedOrderId })).unwrap();
        dispatch(fetchPurchaseHistory(user._id));
      } else {
        await dispatch(cancelGuestOrder({ orderCode: selectedOrderId })).unwrap();
      }
      if (searchQuery.trim()) dispatch(searchOrderByCode(searchQuery));
    } catch (error) {
      console.error("❌ Lỗi khi hủy đơn hàng:", error);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại.");
    }
    handleCloseModal();
  };

  return (
    <Container id="cart-page-container" tabIndex="-1">
      <CartTabs currentTab={currentTab} handleTabChange={handleTabChange} />
      {currentTab === 0 ? (
        <>
          <CartList
            cartItems={cartItems}
            selectedItems={selectedItems}
            handleCheckboxChange={handleCheckboxChange}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
          />
          <CartSummary
            totalPrice={totalPrice}
            selectedItems={selectedItems}
            handleClearCart={handleClearCart}
            handleProceedToCheckout={handleProceedToCheckout}
          />
        </>
      ) : (
        <>
          <OrderSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
            searchResult={searchResult}
            searchError={searchError}
            expandedOrders={expandedOrders}
            toggleExpand={toggleExpand}
            handleOpenModal={handleOpenModal}
            user={user}
          />
          <OrderList
            purchaseHistory={purchaseHistory}
            expandedOrders={expandedOrders}
            toggleExpand={toggleExpand}
            handleOpenModal={handleOpenModal}
          />
        </>
      )}
      <CancelOrderDialog
        open={openModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmCancelOrder}
      />
    </Container>
  );
};

export default CartPage;
