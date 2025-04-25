// ⚙️ Redux Toolkit version of cartSlice.js (refactored)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

export const loadCartFromSessionStorage = () => {
  try {
    const serializedState = sessionStorage.getItem("cart");
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    return [];
  }
};

const saveCartToSessionStorage = (cart) => {
  try {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Không thể lưu giỏ hàng vào sessionStorage", e);
  }
};

const removeCartFromSessionStorage = () => {
  sessionStorage.removeItem("cart");
};

const initialState = {
  cart: loadCartFromSessionStorage(),
  detailedCart: [],
  isLoading: false,
  error: null,
  totalItems: loadCartFromSessionStorage().reduce((total, item) => total + item.quantity, 0),
};

export const addToCart = createAsyncThunk("cart/addToCart", async (book, { getState, rejectWithValue }) => {
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
    return payload;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const syncCartAfterLogin = createAsyncThunk("cart/syncAfterLogin", async (userId, { rejectWithValue }) => {
  const sessionCart = loadCartFromSessionStorage();
  try {
    const response = await apiService.post(`/carts/sync`, { userId, cart: sessionCart });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const clearAllCartItems = createAsyncThunk("cart/clearAll", async (_, { getState, rejectWithValue }) => {
  const { user, isAuthenticated } = getState().user;
  try {
    if (isAuthenticated && user) {
      await apiService.delete(`/carts`);
    } else {
      sessionStorage.removeItem("cart");
    }
    return true;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const loadCart = createAsyncThunk("cart/loadCart", async (_, { getState, rejectWithValue }) => {
  const { cart } = getState().cart;
  if (cart.length === 0) return [];
  try {
    const bookIds = cart.map((item) => item.bookId);
    const response = await apiService.post("/books/carts", { bookIds });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateCartQuantity = createAsyncThunk("cart/updateQuantity", async ({ bookId, quantity }, { getState, rejectWithValue }) => {
  const { user, isAuthenticated } = getState().user;
  try {
    if (isAuthenticated) {
      await apiService.put("/carts/update", { userId: user._id, bookId, quantity });
    }
    return { bookId, quantity };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeBookFromCart = createAsyncThunk("cart/removeBook", async (bookId, { getState, rejectWithValue }) => {
  const { user, isAuthenticated } = getState().user;
  try {
    if (isAuthenticated) {
      await apiService.delete(`/carts`, { data: { bookId } });
    }
    return bookId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleSelectBook(state, action) {
      const { bookId, isSelected } = action.payload;
      const cartItem = state.cart.find((item) => item.bookId === bookId);
      if (cartItem) cartItem.isSelected = isSelected;
    },
    triggerCartReload(state) {
      state.cartReloadTrigger = !state.cartReloadTrigger;
    },
    clearCart(state) {
      state.cart = [];
      state.detailedCart = [];
      removeCartFromSessionStorage();
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => { state.isLoading = true; })
      .addCase(addToCart.fulfilled, (state, action) => {
        const book = action.payload;
        const existingItem = state.cart.find(item => item.bookId === book.bookId);
        if (existingItem) existingItem.quantity += book.quantity;
        else state.cart.push({ ...book, quantity: book.quantity });
        state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        saveCartToSessionStorage(state.cart);
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(removeBookFromCart.fulfilled, (state, action) => {
        const bookId = action.payload;
        state.cart = state.cart.filter(book => book.bookId !== bookId);
        state.detailedCart = state.detailedCart.filter(book => book.bookId !== bookId);
        state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        saveCartToSessionStorage(state.cart);
        state.isLoading = false;
      })

      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { bookId, quantity } = action.payload;
        const item = state.cart.find(book => book.bookId === bookId);
        if (item) item.quantity = quantity;
        state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        saveCartToSessionStorage(state.cart);
        state.isLoading = false;
      })

      .addCase(syncCartAfterLogin.fulfilled, (state, action) => {
        state.cart = action.payload;
        saveCartToSessionStorage(state.cart);
        state.isLoading = false;
      })

      .addCase(clearAllCartItems.fulfilled, (state) => {
        state.cart = [];
        state.detailedCart = [];
        removeCartFromSessionStorage();
        state.isLoading = false;
        toast.success("xoá giỏ hàng thành công");
      })

      .addCase(loadCart.fulfilled, (state, action) => {
        state.detailedCart = action.payload.map(book => ({
          ...book,
          bookId: book._id,
          quantity: book.quantity || 1,
        }));
        state.isLoading = false;
      })

      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => { state.isLoading = true; }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { toggleSelectBook, triggerCartReload, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
