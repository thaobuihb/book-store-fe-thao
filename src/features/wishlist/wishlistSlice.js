import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

// Helper functions cho localStorage
export const loadWishlistFromLocalStorage = () => {
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
      console.log("Before removing:", state.wishlist);
      state.wishlist = state.wishlist.filter(
        (bookId) => bookId !== action.payload
      );
      console.log("After removing:", state.wishlist);
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
  syncWishlistFromBackendSuccess, 
} = wishlistSlice.actions;

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

  // Đồng bộ ngay lập tức với localStorage sau khi click vào yêu thích
  const updatedWishlist = getState().wishlist.wishlist;
  saveWishlistToLocalStorage(updatedWishlist);
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
    // Lấy wishlist từ localStorage
    const localWishlist = loadWishlistFromLocalStorage();

    console.log("Syncing wishlist to server:", localWishlist);

    // Gửi localWishlist lên server để đồng bộ
    const response = await apiService.post(`/wishlist/sync`, {
      userId,
      localWishlist, 
    });

    console.log("Response from server after syncing:3333333", response.userId);

    // Cập nhật Redux store với wishlist được trả về từ server
    dispatch(syncWishlistFromBackendSuccess(response.data));

    // Cập nhật lại localStorage với wishlist từ server
    saveWishlistToLocalStorage(response.data.map((book) => book.bookId));

    toast.success("Đồng bộ wishlist thành công");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Không thể đồng bộ wishlist từ backend");
  }
};



export const clearWishlistOnLogout = (userId) => async (dispatch, getState) => {
  try {
    const { detailedWishlist } = getState().wishlist;

    await apiService.post(`/wishlist/sync`, {
      userId,
      localWishlist: detailedWishlist,
    });

    dispatch(clearWishlist()); 
    localStorage.removeItem("wishlist"); 

    console.log("Wishlist đã được đồng bộ và xóa khi logout.");
  } catch (error) {
    console.error("Lỗi khi đồng bộ wishlist trước khi logout:", error);
  }
};

export const deleteBookInWishlist = () => async(dispatch, getState) => {
  try {
    const {detailedWishlist} = getState().wishlist;
    await apiService.delete(`wishlist/remove`, {
      localWishlist: detailedWishlist,
    })
    dispatch(clearWishlist()); 
    localStorage.removeItem("wishlist"); 
    
  } catch (error) {
    console.error("không thể xoá sách khỏi danh sách yêu thích", error)
    
  }
}

export default wishlistSlice.reducer;
