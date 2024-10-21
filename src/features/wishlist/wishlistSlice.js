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

export const toggleBookInWishlist = (bookId) => async (dispatch, getState) => {
  dispatch(startLoading());

  const state = getState();
  const { wishlist } = state.wishlist;
  const { user, isAuthenticated } = state.user;

  console.log("User state from Redux:", user);

  // Nếu người dùng đã đăng xuất hoặc chưa đăng nhập
  if (!isAuthenticated || !user || !user._id) {
    console.log("User is not authenticated, saving to localStorage");

    // Thêm sách vào localStorage
    if (!wishlist.includes(bookId)) {
      dispatch(addBookToWishlistSuccess(bookId)); // Lưu vào Redux store
      toast.success("Sách đã được thêm vào danh sách yêu thích (local)");

      const updatedWishlist = getState().wishlist.wishlist;
      saveWishlistToLocalStorage(updatedWishlist); // Cập nhật localStorage
    } else {
      dispatch(removeBookFromWishlistSuccess(bookId)); // Xóa khỏi Redux store
      toast.success("Sách đã được xóa khỏi danh sách yêu thích (local)");

      const updatedWishlist = getState().wishlist.wishlist;
      saveWishlistToLocalStorage(updatedWishlist); // Cập nhật localStorage
    }

    return; // Dừng lại ở đây nếu người dùng đã đăng xuất hoặc chưa đăng nhập
  }

  // Nếu người dùng đã đăng nhập, gửi yêu cầu lên server
  const isAlreadyInWishlist = wishlist.includes(bookId);

  try {
    if (isAlreadyInWishlist) {
      const response = await apiService.post(`/wishlist/remove`, { userId: user._id, bookId });
      dispatch(removeBookFromWishlistSuccess(bookId));
      toast.success("Đã xóa sách khỏi danh sách yêu thích");
    } else {
      const response = await apiService.post(`/wishlist/add`, { userId: user._id, bookId });
      dispatch(addBookToWishlistSuccess(bookId));
      toast.success("Đã thêm sách vào danh sách yêu thích");
    }

    const updatedWishlist = getState().wishlist.wishlist;
    saveWishlistToLocalStorage(updatedWishlist); // Cập nhật localStorage sau khi đồng bộ với server
  } catch (error) {
    console.error("Error syncing wishlist with server:", error.message);
    dispatch(hasError(error.message));
    toast.error("Không thể đồng bộ sách yêu thích với server");
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
    // Lấy wishlist từ localStorage
    const localWishlist = loadWishlistFromLocalStorage();

    // Gửi localWishlist lên server để đồng bộ
    const response = await apiService.post(`/wishlist/sync`, {
      userId,
      localWishlist, 
    });

    // Kiểm tra xem response.data.books có phải là mảng hay không trước khi gọi .map()
    const books = response.data && Array.isArray(response.data.books) ? response.data.books : [];

    // Cập nhật Redux store với wishlist được trả về từ server
    dispatch(syncWishlistFromBackendSuccess(books));

    // Cập nhật lại localStorage với wishlist từ server
    saveWishlistToLocalStorage(books.map((book) => book.bookId));

    toast.success("Đồng bộ wishlist thành công");
  } catch (error) {
    dispatch(hasError(error.message));
    console.error("Error syncing wishlist:", error.response ? error.response.data : error.message);
    toast.error("Không thể đồng bộ wishlist từ backend");
  }
};





export const clearWishlistOnLogout = () => async (dispatch) => {
  try {
    // Không cần đồng bộ lại vì đã đồng bộ trước đó
    dispatch(clearWishlist()); // Xóa wishlist khỏi Redux
    localStorage.removeItem("wishlist"); // Xóa wishlist khỏi localStorage
  } catch (error) {
    console.error("Lỗi khi xóa wishlist trước khi logout:", error.message);
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
