import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

// Helper functions cho localStorage
const loadWishlistFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("wishlist");
    let wishlist = serializedState ? JSON.parse(serializedState) : [];
    return wishlist.filter((item) => item && typeof item === "string");
  } catch (e) {
    return [];
  }
};

const saveWishlistToLocalStorage = (wishlist) => {
  try {
    const wishlistArray = Array.isArray(wishlist) ? wishlist.slice() : [];
    console.log("Saving to localStorage:", wishlistArray);
    const serializedState = JSON.stringify(wishlist);
    localStorage.setItem("wishlist", serializedState); // Lưu danh sách sách yêu thích vào localStorage
  } catch (e) {
    console.error("Không thể lưu wishlist vào localStorage", e);
  }
};
// Initial state
const initialState = {
  wishlist: loadWishlistFromLocalStorage(), // Lưu ID sách
  detailedWishlist: [], // Để lưu thông tin chi tiết của sách
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
        state.wishlist.push(action.payload); // Thêm ID sách vào localStorage
        saveWishlistToLocalStorage(state.wishlist); // Lưu danh sách vào localStorage
      }
      state.isLoading = false;
    },
    removeBookFromWishlistSuccess(state, action) {
      console.log("Before removing:", state.wishlist);
      state.wishlist = state.wishlist.filter(
        (bookId) => bookId !== action.payload
      );
      console.log("After removing:", state.wishlist);
      // Lưu lại danh sách mới vào localStorage
      saveWishlistToLocalStorage(state.wishlist);
      state.detailedWishlist = state.detailedWishlist.filter(
        (book) => book._id !== action.payload
      );
      state.isLoading = false;
    },
    loadWishlistDetailsSuccess(state, action) {
      state.detailedWishlist = action.payload; // Lưu thông tin chi tiết của sách
      state.isLoading = false;
    },
    clearWishlist(state) {
      state.wishlist = [];
      state.detailedWishlist = [];
      localStorage.removeItem("wishlist"); // Xóa wishlist từ localStorage
      state.isLoading = false;
    },
    syncWishlistFromBackendSuccess(state, action) {
      state.wishlist = action.payload.map((book) => book.bookId);
      state.detailedWishlist = action.payload;
      saveWishlistToLocalStorage(state.wishlist);
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
  syncWishlistFromBackendSuccess, // Đảm bảo action này có mặt
} = wishlistSlice.actions;

// Thêm hoặc xóa sách khỏi wishlist (toggle)
export const toggleBookInWishlist = (bookId) => (dispatch, getState) => {
  dispatch(startLoading());
  const state = getState();
  const { wishlist } = state.wishlist;

  const isAlreadyInWishlist = wishlist.includes(bookId);

  if (isAlreadyInWishlist) {
    dispatch(removeBookFromWishlistSuccess(bookId)); // Xóa sách khỏi wishlist
    toast.success("Đã xóa sách khỏi danh sách yêu thích");
  } else {
    dispatch(addBookToWishlistSuccess(bookId)); // Thêm ID sách vào wishlist
    toast.success("Đã thêm sách vào danh sách yêu thích");
  }
};

// Tải thông tin chi tiết wishlist khi người dùng mở trang
export const loadWishlist = () => async (dispatch, getState) => {
  dispatch(startLoading());

  const state = getState();
  const { wishlist } = state.wishlist;

  if (wishlist.length === 0) {
    dispatch(loadWishlistDetailsSuccess([]));
    return;
  }

  try {
    const validBookIds = wishlist.filter((id) => id);
    const response = await apiService.post("/books/wishlist", { bookIds: validBookIds });
    dispatch(loadWishlistDetailsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Không thể lấy thông tin sách");
  }
};


// Đồng bộ wishlist sau khi người dùng đăng nhập
export const syncWishlistAfterLogin = (userId) => async (dispatch, getState) => {
  dispatch(startLoading());
  try {
    const { detailedWishlist } = getState().wishlist;

    console.log("Syncing wishlist to server:", detailedWishlist);

    const response = await apiService.post(`/wishlist/sync`, {
      userId,
      localWishlist: detailedWishlist,  // Đảm bảo đây là một mảng chứa các đối tượng sách đầy đủ
    });

    console.log("Response from server after syncing:", response.data);

    dispatch(syncWishlistFromBackendSuccess(response.data));
    toast.success("Đồng bộ wishlist thành công");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Không thể đồng bộ wishlist từ backend");
  }
};


export const clearWishlistOnLogout = () => (dispatch) => {
  dispatch(clearWishlist()); // Xóa trên Redux store
  localStorage.removeItem("wishlist"); // Xóa khỏi localStorage
};

export default wishlistSlice.reducer;
