import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

export const loadCartFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Không thể lưu giỏ hàng vào localStorage", e);
  }
};

const removeCartFromLocalStorage = () => {
  localStorage.removeItem("cart");
};

const initialState = {
  cart: loadCartFromLocalStorage(),
  detailedCart: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addBookToCartSuccess(state, action) {
      const book = action.payload;
      const existingItem = state.cart.find(item => item.bookId === book.bookId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...book, quantity: 1 });
      }
      saveCartToLocalStorage(state.cart);
      state.isLoading = false;
    },
    removeBookFromCartSuccess(state, action) {
      state.cart = state.cart.filter(book => book.bookId !== action.payload);
      saveCartToLocalStorage(state.cart);
      state.isLoading = false;
    },
    updateCartQuantity(state, action) {
      const { bookId, quantity } = action.payload;
      const item = state.cart.find(book => book.bookId === bookId);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToLocalStorage(state.cart);
      state.isLoading = false;
    },
    clearCart(state) {
      state.cart = [];
      removeCartFromLocalStorage();
      state.isLoading = false;
    },
    syncCartFromBackendSuccess(state, action) {
      state.cart = action.payload;
      saveCartToLocalStorage(state.cart);
      state.isLoading = false;
    },
    clearAllCartItemsSuccess(state) {
      state.cart = [];
      removeCartFromLocalStorage();
      state.isLoading = false;
    },
  },
});

export const {
  startLoading,
  hasError,
  addBookToCartSuccess,
  removeBookFromCartSuccess,
  updateCartQuantity,
  clearCart,
  syncCartFromBackendSuccess,
  clearAllCartItemsSuccess
} = cartSlice.actions;

export const addToCart = (book) => async (dispatch, getState) => {
  dispatch(startLoading());
  const state = getState();
  const { user, isAuthenticated } = state.user;

  try {
    if (isAuthenticated) {
      // Kiểm tra và truyền đầy đủ userId và book data
      await apiService.post("/carts", { 
        userId: user._id, 
        bookId: book.bookId, 
        quantity: 1, 
        price: book.price 
      });
    }
    dispatch(addBookToCartSuccess(book));
    toast.success("Book added to the cart");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Error adding book to cart");
  }
};


export const syncCartAfterLogin = (userId) => async (dispatch) => {
  dispatch(startLoading());

  const localCart = loadCartFromLocalStorage();

  try {
    const response = await apiService.post(`/carts/sync`, { userId, cart: localCart });
    dispatch(syncCartFromBackendSuccess(response.data));
    saveCartToLocalStorage(response.data);
    toast.success("Cart synced successfully");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Error syncing cart");
  }
};

export const clearCartOnLogout = () => (dispatch) => {
  dispatch(clearCart());
  localStorage.removeItem("cart");
};


export const clearAllCartItems = () => async (dispatch, getState) => {
  dispatch(startLoading());
  const { user, isAuthenticated } = getState().user;

  if (isAuthenticated && user) {
    try {
      await apiService.post(`/carts/clear`, { userId: user._id });
      dispatch(clearAllCartItemsSuccess());
      toast.success("Cart cleared successfully");
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error("Error clearing cart");
    }
  } else {
    dispatch(clearCart());
    toast.success("Cart cleared successfully");
  }
};

export default cartSlice.reducer;
