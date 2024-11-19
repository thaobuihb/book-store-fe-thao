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
    toggleSelectBook(state, action) {
      const { bookId, isSelected } = action.payload;
      const cartItem = state.cart.find((item) => item.bookId === bookId);
      if (cartItem) {
        cartItem.isSelected = isSelected;
      }
    },
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
        existingItem.quantity += book.quantity; 
      } else {
        state.cart.push({ ...book, quantity: book.quantity }); 
      }
      saveCartToLocalStorage(state.cart);
      state.isLoading = false;
    },
    removeBookFromCartSuccess(state, action) {
      state.cart = state.cart.filter((book) => book.bookId !== action.payload);
      state.detailedCart = state.detailedCart.filter((book) => book.bookId !== action.payload); // Cập nhật cả detailedCart nếu cần
      saveCartToLocalStorage(state.cart);
      state.isLoading = false;
    },
    updateCartQuantitySuccess(state, action) {
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
      state.detailedCart = [];
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
      state.detailedCart = [];
      removeCartFromLocalStorage();
      state.isLoading = false;
    },
    loadCartDetailsSuccess(state, action) {
      state.detailedCart = action.payload.map(book => ({
        ...book,
        bookId: book._id,        
        quantity: book.quantity || 1,  
      }));
      state.isLoading = false;
    }
  },
});

export const {
  toggleSelectBook,
  startLoading,
  hasError,
  addBookToCartSuccess,
  removeBookFromCartSuccess,
  updateCartQuantitySuccess,
  clearCart,
  syncCartFromBackendSuccess,
  clearAllCartItemsSuccess,
  loadCartDetailsSuccess
} = cartSlice.actions;

export const addToCart = (book) => async (dispatch, getState) => {
  dispatch(startLoading());
  const state = getState();
  const { user, isAuthenticated } = state.user;

  const payload = {
    userId: user?._id,
    bookId: book.bookId || book._id,
    quantity: book.quantity && book.quantity > 0 ? book.quantity : 1, 
    price: book.discountedPrice || book.price || 0, 
  };

  try {
    if (isAuthenticated) {
      await apiService.post("/carts", payload);
    }
    dispatch(addBookToCartSuccess(payload)); 
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

  try {
    if (isAuthenticated && user) {
      // console.log("User is authenticated, attempting to clear cart on server.");
      
      // Gửi yêu cầu DELETE để xóa giỏ hàng trên server
      const response = await apiService.delete(`/carts`);
      // console.log("Server response for clearing cart:", response);
    } else {
      // console.log("User not authenticated, clearing cart from localStorage.");
      
      // Xóa giỏ hàng khỏi localStorage nếu người dùng chưa đăng nhập
      localStorage.removeItem("cart");
    }

    // Cập nhật Redux store
    dispatch(clearAllCartItemsSuccess());
    // console.log("Cart cleared successfully in Redux.");
    toast.success("Cart cleared successfully");
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    dispatch(hasError(error.message));
    toast.error("Error clearing cart");
  }
};



// Lấy chi tiết sách trong giỏ hàng
export const loadCart = () => async (dispatch, getState) => {
  dispatch(startLoading());

  const state = getState();
  const { cart } = state.cart;

  if (cart.length === 0) {
    dispatch(loadCartDetailsSuccess([])); 
    return;
  }

  try {
    
    const bookIds = cart.map((item) => item.bookId);

    const response = await apiService.post("/books/carts", { bookIds });
    dispatch(loadCartDetailsSuccess(response.data)); 
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Không thể lấy thông tin sách");
  }
};

export const updateCartQuantity = ({ bookId, quantity }) => async (dispatch, getState) => {
  dispatch(startLoading());
  const state = getState();
  const { user, isAuthenticated } = state.user;

  try {
    if (isAuthenticated) {
      await apiService.put("/carts/update", { userId: user._id, bookId, quantity });
    }
    dispatch(updateCartQuantitySuccess({ bookId, quantity }));
    toast.success("Cart quantity updated successfully");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Error updating cart quantity");
  }
};

export const removeBookFromCart = (bookId) => async (dispatch, getState) => {
  const { user, isAuthenticated } = getState().user;
  if (isAuthenticated) {
    try {
      await apiService.delete(`/carts`, { data: { bookId } });
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error("Lỗi khi xóa sách khỏi giỏ hàng trên server");
      return;
    }
  }
  dispatch(removeBookFromCartSuccess(bookId));
  toast.success("Sách đã được xóa khỏi giỏ hàng");
};


export default cartSlice.reducer;
