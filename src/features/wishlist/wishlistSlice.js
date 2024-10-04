import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

const loadWishlistFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("wishlist");
    let wishlist = serializedState ? JSON.parse(serializedState) : [];

    wishlist = wishlist.filter((item) => item && typeof item === "string");
    return wishlist;
  } catch (e) {
    return [];
  }
};

const saveWishlistToLocalStorage = (wishlist) => {
  try {
    const filteredWishlist = wishlist.filter(
      (item) => item && typeof item === "string"
    );
    const serializedState = JSON.stringify(filteredWishlist);
    localStorage.setItem("wishlist", serializedState);
  } catch (e) {
    console.error("Không thể lưu wishlist vào localStorage", e);
  }
};

// Initial state
const initialState = {
  wishlist: loadWishlistFromLocalStorage(),
  detailedWishlist: [],
  isLoading: false,
  error: null,
};

// Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addBookToWishlistSuccess(state, action) {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
        saveWishlistToLocalStorage(state.wishlist);
      }
      state.isLoading = false;
    },
    removeBookFromWishlistSuccess(state, action) {
      state.wishlist = state.wishlist.filter(
        (bookId) => bookId !== action.payload
      );
      saveWishlistToLocalStorage(state.wishlist);
      state.detailedWishlist = state.detailedWishlist.filter(
        (book) => book._id !== action.payload
      );
      state.isLoading = false;
    },
    loadWishlistDetailsSuccess(state, action) {
      state.detailedWishlist = action.payload;
      state.isLoading = false;
    },
    clearWishlist(state) {
      state.wishlist = [];
      state.detailedWishlist = [];
      localStorage.removeItem("wishlist");
      state.isLoading = false;
    },
  },
});

// Action creators
export const {
  startLoading,
  hasError,
  addBookToWishlistSuccess,
  removeBookFromWishlistSuccess,
  loadWishlistDetailsSuccess,
  clearWishlist,
} = wishlistSlice.actions;

export const fetchWishlistDetails = () => async (dispatch, getState) => {
  dispatch(startLoading());

  const state = getState();
  const { wishlist } = state.wishlist;

  if (wishlist.length === 0) {
    dispatch(loadWishlistDetailsSuccess([]));
    return;
  }

  try {
    console.log("Book IDs to fetch details:", wishlist);

    const validBookIds = wishlist.filter((id) => id);

    const response = await apiService.post("/books/wishlist", {
      bookIds: validBookIds,
    });
    console.log("Books wishlist from API:", response.data);
    dispatch(loadWishlistDetailsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Không thể lấy thông tin sách");
  }
};

export const toggleBookInWishlist = (bookId) => (dispatch, getState) => {
  dispatch(startLoading());

  const state = getState();
  const { wishlist } = state.wishlist;

  const isAlreadyInWishlist = wishlist.includes(bookId);

  if (isAlreadyInWishlist) {
    dispatch(removeBookFromWishlistSuccess(bookId));
    toast.success("Đã xóa sách khỏi danh sách yêu thích");
  } else {
    dispatch(addBookToWishlistSuccess(bookId));
    toast.success("Đã thêm sách vào danh sách yêu thích");
  }
};

export const loadWishlist = () => (dispatch) => {
  dispatch(fetchWishlistDetails());
};

export const clearWishlistFromLocal = () => (dispatch) => {
  dispatch(clearWishlist());
};

export default wishlistSlice.reducer;
