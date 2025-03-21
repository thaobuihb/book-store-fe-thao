import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

// Helper functions cho localStorage
// export const loadWishlistFromLocalStorage = () => {
//   try {
//     const serializedState = localStorage.getItem("wishlist");
//     let wishlist = serializedState ? JSON.parse(serializedState) : [];
//     return wishlist.filter((item) => item && typeof item === "string");
//   } catch (e) {
//     return [];
//   }
// };

// const saveWishlistToLocalStorage = (wishlist) => {
//   try {
//     const sanitizedWishlist = wishlist.map((item) => 
//       typeof item === "object" && item !== null ? item.bookId || item._id : item
//     );
//     console.log("Saving to localStorage:", sanitizedWishlist);
//     localStorage.setItem("wishlist", JSON.stringify(sanitizedWishlist));
//   } catch (e) {
//     console.error("Không thể lưu wishlist vào localStorage", e);
//   }
// };

export const loadWishlistFromSessionStorage = () => {
  try {
    const serializedState = sessionStorage.getItem("wishlist");
    let wishlist = serializedState ? JSON.parse(serializedState) : [];
    return wishlist.filter((item) => item && typeof item === "string");
  } catch (e) {
    return [];
  }
};

const saveWishlistToSessionStorage = (wishlist) => {
  try {
    const sanitizedWishlist = wishlist.map((item) =>
      typeof item === "object" && item !== null ? item.bookId || item._id : item
    );
    console.log("Saving to sessionStorage:", sanitizedWishlist);
    sessionStorage.setItem("wishlist", JSON.stringify(sanitizedWishlist));
  } catch (e) {
    console.error("Không thể lưu wishlist vào sessionStorage", e);
  }
};

const removeWishlistFromSessionStorage = () => {
  sessionStorage.removeItem("wishlist");
};


// Initial state
const initialState = {
  // wishlist: loadWishlistFromLocalStorage(), 
  wishlist: loadWishlistFromSessionStorage(), 
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
    // addBookToWishlistSuccess(state, action) {
    //   if (!state.wishlist.includes(action.payload)) {
    //     state.wishlist.push(action.payload);
    //     console.log("Wishlist before saving:", state.wishlist);
    //     saveWishlistToLocalStorage(state.wishlist);
    //   }
    //   state.isLoading = false;
    // },
    addBookToWishlistSuccess(state, action) {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
        console.log("Wishlist before saving:", state.wishlist);
        saveWishlistToSessionStorage(state.wishlist);
      }
      state.isLoading = false;
    },
    
    // removeBookFromWishlistSuccess(state, action) {
    //   console.log("Before removing:", state.wishlist);
    //   state.wishlist = state.wishlist.filter(
    //     (bookId) => bookId !== action.payload
    //   );
    //   console.log("After removing:", state.wishlist);
    //   saveWishlistToLocalStorage(state.wishlist);
    //   state.detailedWishlist = state.detailedWishlist.filter(
    //     (book) => book._id !== action.payload
    //   );
    //   state.isLoading = false;
    // },
    removeBookFromWishlistSuccess(state, action) {
      console.log("Before removing:", state.wishlist);
      state.wishlist = state.wishlist.filter(
        (bookId) => bookId !== action.payload
      );
      console.log("After removing:", state.wishlist);
      saveWishlistToSessionStorage(state.wishlist);
      state.detailedWishlist = state.detailedWishlist.filter(
        (book) => book._id !== action.payload
      );
      state.isLoading = false;
    },
    
    loadWishlistDetailsSuccess(state, action) {
      state.detailedWishlist = action.payload; 
      state.isLoading = false;
    },
    // clearWishlist(state) {
    //   state.wishlist = [];
    //   state.detailedWishlist = [];
    //   localStorage.removeItem("wishlist"); 
    //   state.isLoading = false;
    // },
    clearWishlist(state) {
      state.wishlist = [];
      state.detailedWishlist = [];
      removeWishlistFromSessionStorage();
      state.isLoading = false;
    },
    
    // syncWishlistFromBackendSuccess(state, action) {
    //   state.wishlist = action.payload.map((book) => book.bookId);
    //   state.detailedWishlist = action.payload;
    //   saveWishlistToLocalStorage(state.wishlist);
    //   state.isLoading = false;
    // },
    syncWishlistFromBackendSuccess(state, action) {
  state.wishlist = action.payload.map((book) => book.bookId);
  state.detailedWishlist = action.payload;
  saveWishlistToSessionStorage(state.wishlist);
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
      dispatch(addBookToWishlistSuccess(bookId)); 
      toast.success("Sách đã được thêm vào danh sách yêu thích (local)");

      const updatedWishlist = getState().wishlist.wishlist;
      // saveWishlistToLocalStorage(updatedWishlist); 
      saveWishlistToSessionStorage(updatedWishlist); 
    } else {
      dispatch(removeBookFromWishlistSuccess(bookId)); 
      toast.success("Sách đã được xóa khỏi danh sách yêu thích (local)");

      const updatedWishlist = getState().wishlist.wishlist;
      // saveWishlistToLocalStorage(updatedWishlist); 
      saveWishlistToSessionStorage(updatedWishlist); 
    }

    return; 
  }

  // Nếu người dùng đã đăng nhập, gửi yêu cầu lên server
  const isAlreadyInWishlist = wishlist.includes(bookId);

  try {
    if (isAlreadyInWishlist) {
      const token = localStorage.getItem('accessToken');
      await apiService({
        method: 'DELETE',
        url: `/wishlist/remove`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: user._id,
          bookId,
        }
      });
      dispatch(removeBookFromWishlistSuccess(bookId));
      toast.success("Đã xóa sách khỏi danh sách yêu thích");
    } else {
      const response = await apiService.post(`/wishlist/add`, { userId: user._id, bookId });
      dispatch(addBookToWishlistSuccess(bookId));
      toast.success("Đã thêm sách vào danh sách yêu thích");
    }

    const updatedWishlist = getState().wishlist.wishlist;
    // saveWishlistToLocalStorage(updatedWishlist); 
    saveWishlistToSessionStorage(updatedWishlist); 
  } catch (error) {
    console.error("Error syncing wishlist with server:", error.message);
    dispatch(hasError(error.message));
    toast.error("Không thể đồng bộ sách yêu thích với server");
  }
};

export const removeBookFromWishlist = (bookId) => async (dispatch, getState) => {
  const state = getState();
  const { isAuthenticated, user } = state.user;
  const { wishlist } = state.wishlist;

  try {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('accessToken');

      console.log("User ID:", user._id);
      console.log("Book ID:", bookId);
      console.log("Token:", token);
      
      // Trường hợp người dùng đã đăng nhập
      await apiService.delete(`/wishlist/remove`, {
        data: {
          userId: user._id,  
          bookId
        },
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

      dispatch(removeBookFromWishlistSuccess(bookId)); 
      toast.success("Sách đã được xóa khỏi danh sách yêu thích");
    } else {
      // Trường hợp người dùng chưa đăng nhập (xóa từ localStorage)
      const updatedWishlist = wishlist.filter((id) => id !== bookId);
      // saveWishlistToLocalStorage(updatedWishlist);  
      saveWishlistToSessionStorage(updatedWishlist);  
      dispatch(removeBookFromWishlistSuccess(bookId)); 
      toast.success("Sách đã được xóa khỏi danh sách yêu thích (local)");
    }
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Không thể xóa sách khỏi danh sách yêu thích");
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

// // Đồng bộ wishlist sau khi người dùng đăng nhập
// export const syncWishlistAfterLogin = (userId) => async (dispatch, getState) => {
//   dispatch(startLoading());
//   try {
//     // Lấy wishlist từ localStorage
//     const localWishlist = loadWishlistFromLocalStorage();

//     // Gửi localWishlist lên server để đồng bộ
//     const response = await apiService.post(`/wishlist/sync`, {
//       userId,
//       localWishlist, 
//     });

//     // Kiểm tra xem response.data.books có phải là mảng hay không trước khi gọi .map()
//     const books = response.data && Array.isArray(response.data.books) ? response.data.books : [];

//     // Cập nhật Redux store với wishlist được trả về từ server
//     dispatch(syncWishlistFromBackendSuccess(books));

//     // Cập nhật lại localStorage với wishlist từ server
//     saveWishlistToLocalStorage(books.map((book) => book.bookId));

//     toast.success("Đồng bộ wishlist thành công");
//   } catch (error) {
//     dispatch(hasError(error.message));
//     console.error("Error syncing wishlist:", error.response ? error.response.data : error.message);
//     toast.error("Không thể đồng bộ wishlist từ backend");
//   }
// };


export const syncWishlistAfterLogin = (userId) => async (dispatch, getState) => {
  dispatch(startLoading());

  try {
    // Lấy wishlist từ sessionStorage thay vì localStorage
    const sessionWishlist = loadWishlistFromSessionStorage();

    // Gửi sessionWishlist lên server để đồng bộ
    const response = await apiService.post(`/wishlist/sync`, {
      userId,
      localWishlist: sessionWishlist, 
    });

    // Kiểm tra xem response.data.books có phải là mảng hay không trước khi gọi .map()
    const books = response.data && Array.isArray(response.data.books) ? response.data.books : [];

    // Cập nhật Redux store với wishlist được trả về từ server
    dispatch(syncWishlistFromBackendSuccess(books));

    // Cập nhật lại sessionStorage với wishlist từ server
    saveWishlistToSessionStorage(books.map((book) => book.bookId));

    toast.success("Đồng bộ wishlist thành công");
  } catch (error) {
    dispatch(hasError(error.message));
    console.error("Error syncing wishlist:", error.response ? error.response.data : error.message);
    toast.error("Không thể đồng bộ wishlist từ backend");
  }
};



// export const clearWishlistOnLogout = () => async (dispatch) => {
//   try {
    
//     dispatch(clearWishlist()); 
//     localStorage.removeItem("wishlist"); 
//   } catch (error) {
//     console.error("Lỗi khi xóa wishlist trước khi logout:", error.message);
//   }
// };

export const clearWishlistOnLogout = () => async (dispatch) => {
  try {
    dispatch(clearWishlist());
    sessionStorage.removeItem("wishlist"); // Xóa wishlist khi đăng xuất
  } catch (error) {
    console.error("Lỗi khi xóa wishlist trước khi logout:", error.message);
  }
};


// export const deleteBookInWishlist = () => async(dispatch, getState) => {
//   try {
//     const {detailedWishlist} = getState().wishlist;
//     await apiService.delete(`wishlist/remove`, {
//       localWishlist: detailedWishlist,
//     })
//     dispatch(clearWishlist()); 
//     localStorage.removeItem("wishlist"); 
    
//   } catch (error) {
//     console.error("không thể xoá sách khỏi danh sách yêu thích", error)
    
//   }
// }

export const deleteBookInWishlist = () => async(dispatch, getState) => {
  try {
    const {detailedWishlist} = getState().wishlist;
    await apiService.delete(`wishlist/remove`, {
      localWishlist: detailedWishlist,
    })
    dispatch(clearWishlist()); 
    sessionStorage.removeItem("wishlist"); 
    
  } catch (error) {
    console.error("không thể xoá sách khỏi danh sách yêu thích", error)
    
  }
}

export const clearAllWishlistItems = () => async (dispatch, getState) => {
  dispatch(startLoading());
  const { user, isAuthenticated } = getState().user;

  try {
    if (isAuthenticated) {
      await apiService.delete(`/wishlist`);
    }
    dispatch(clearWishlist()); 
    toast.success("Wishlist cleared successfully");
  } catch (error) {
    dispatch(hasError(error.message));
    toast.error("Error clearing wishlist");
  }
};

export default wishlistSlice.reducer;
