// ✅ Refactored wishlistSlice.js using Redux Toolkit + createAsyncThunk
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

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
    sessionStorage.setItem("wishlist", JSON.stringify(sanitizedWishlist));
  } catch (e) {
    console.error("Không thể lưu wishlist vào sessionStorage", e);
  }
};

const removeWishlistFromSessionStorage = () => {
  sessionStorage.removeItem("wishlist");
};

const initialState = {
  wishlist: loadWishlistFromSessionStorage(),
  detailedWishlist: [],
  isLoading: false,
  error: null,
};

export const loadWishlist = createAsyncThunk("wishlist/load", async (_, { getState, rejectWithValue }) => {
  const { wishlist } = getState().wishlist;
  if (wishlist.length === 0) return [];
  try {
    const validBookIds = wishlist.filter((id) => id);
    const response = await apiService.post("/books/wishlist", { bookIds: validBookIds });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const syncWishlistAfterLogin = createAsyncThunk("wishlist/sync", async (userId, { rejectWithValue }) => {
  try {
    const sessionWishlist = loadWishlistFromSessionStorage();
    const response = await apiService.post(`/wishlist/sync`, {
      userId,
      localWishlist: sessionWishlist,
    });
    sessionStorage.removeItem("wishlist");
    return response.data.books || [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const clearAllWishlistItems = createAsyncThunk("wishlist/clearAll", async (_, { getState, rejectWithValue }) => {
  const { user, isAuthenticated } = getState().user;
  try {
    if (isAuthenticated) {
      await apiService.delete(`/wishlist`);
    }
    return true;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const toggleBookInWishlist = createAsyncThunk(
  "wishlist/toggleBookInWishlist",
  async (bookId, { getState, dispatch, rejectWithValue }) => {
    const { wishlist } = getState().wishlist;
    const { user, isAuthenticated } = getState().user;
    const isAlreadyInWishlist = wishlist.includes(bookId);

    try {
      if (!isAuthenticated || !user?._id) {
        if (!isAlreadyInWishlist) {
          dispatch(addBookToWishlistSuccess(bookId));
        } else {
          dispatch(removeBookFromWishlistSuccess(bookId));
        }
        saveWishlistToSessionStorage(getState().wishlist.wishlist);
        return;
      }

      if (isAlreadyInWishlist) {
        await apiService.delete("/wishlist/remove", {
          data: { userId: user._id, bookId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        dispatch(removeBookFromWishlistSuccess(bookId));
      } else {
        await apiService.post("/wishlist/add", { userId: user._id, bookId });
        dispatch(addBookToWishlistSuccess(bookId));
      }

      saveWishlistToSessionStorage(getState().wishlist.wishlist);
    } catch (error) {
      toast.error("Không thể đồng bộ sách yêu thích");
      return rejectWithValue(error.message);
    }
  }
);

export const removeBookFromWishlist = createAsyncThunk(
  "wishlist/removeBookFromWishlist",
  async (bookId, { getState, rejectWithValue }) => {
    const state = getState();
    const { isAuthenticated, user } = state.user;
    const { wishlist } = state.wishlist;

    try {
      if (isAuthenticated && user?._id) {
        await apiService.delete(`/wishlist/remove`, {
          data: { userId: user._id, bookId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        return bookId;
      } else {
        const updatedWishlist = wishlist.filter((id) => id !== bookId);
        saveWishlistToSessionStorage(updatedWishlist);
        return bookId;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addBookToWishlistSuccess(state, action) {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
        saveWishlistToSessionStorage(state.wishlist);
      }
    },
    removeBookFromWishlistSuccess(state, action) {
      state.wishlist = state.wishlist.filter((bookId) => bookId !== action.payload);
      state.detailedWishlist = state.detailedWishlist.filter((book) => book._id !== action.payload);
      saveWishlistToSessionStorage(state.wishlist);
    },
    clearWishlist(state) {
      state.wishlist = [];
      state.detailedWishlist = [];
      removeWishlistFromSessionStorage();
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadWishlist.fulfilled, (state, action) => {
        state.detailedWishlist = action.payload;
        state.isLoading = false;
      })
      .addCase(loadWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(syncWishlistAfterLogin.fulfilled, (state, action) => {
        state.wishlist = action.payload.map((book) => book.bookId);
        state.detailedWishlist = action.payload;
        saveWishlistToSessionStorage(state.wishlist);
        state.isLoading = false;
      })
      .addCase(syncWishlistAfterLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(clearAllWishlistItems.fulfilled, (state) => {
        state.wishlist = [];
        state.detailedWishlist = [];
        removeWishlistFromSessionStorage();
        state.isLoading = false;
        toast.success("Wishlist cleared successfully");
      })

      .addCase(removeBookFromWishlist.fulfilled, (state, action) => {
        const bookId = action.payload;
        state.wishlist = state.wishlist.filter((id) => id !== bookId);
        state.detailedWishlist = state.detailedWishlist.filter(
          (book) => book._id !== bookId
        );
        saveWishlistToSessionStorage(state.wishlist);
      })
      .addCase(removeBookFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
        toast.error("Lỗi khi xoá sách khỏi danh sách yêu thích");
      });
  },
});

export const {
  addBookToWishlistSuccess,
  removeBookFromWishlistSuccess,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
