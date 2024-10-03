import { createSlice } from '@reduxjs/toolkit';
import apiService from '../../app/apiService';
import { toast } from 'react-toastify';

// Helper functions for localStorage
const loadWishlistFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('wishlist');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    return [];
  }
};

const saveWishlistToLocalStorage = (wishlist) => {
  try {
    const serializedState = JSON.stringify(wishlist);
    localStorage.setItem('wishlist', serializedState);
  } catch (e) {
    console.error('Could not save wishlist to localStorage', e);
  }
};

// Initial state
const initialState = {
  books: [], // Optional, can store general book list if needed
  wishlist: loadWishlistFromLocalStorage(), // Load wishlist from localStorage
  isLoading: false,
  error: null,
};

// Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
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
      state.wishlist.push(action.payload);  
      state.isLoading = false;
      saveWishlistToLocalStorage(state.wishlist);  // Save wishlist to localStorage
    },
    removeBookFromWishlistSuccess(state, action) {
      state.wishlist = state.wishlist.filter((item) => item._id !== action.payload); 
      state.isLoading = false;
      saveWishlistToLocalStorage(state.wishlist);  // Update wishlist in localStorage
    },
    loadWishlistFromServer(state, action) {
      state.wishlist = action.payload;  // Sync with server
      saveWishlistToLocalStorage(state.wishlist);  // Save to localStorage
      state.isLoading = false;
    },
    clearWishlist(state) {
      state.wishlist = [];  
      localStorage.removeItem('wishlist');  // Clear wishlist from localStorage
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
  loadWishlistFromServer,
  clearWishlist,
} = wishlistSlice.actions;

// Toggle book in wishlist (add/remove)
export const toggleBookInWishlist = (bookId) => (dispatch, getState) => {
  dispatch(startLoading());

  const state = getState();
  const { wishlist } = state.wishlist || { wishlist: [] };

  const isAlreadyInWishlist = wishlist.some((item) => item._id === bookId);

  if (isAlreadyInWishlist) {
    dispatch(removeBookFromWishlist(bookId));  // Remove book from wishlist if it exists
  } else {
    const book = { _id: bookId };  // Add basic book info (you can add more if needed)
    dispatch(addBookToWishlistSuccess(book));
    toast.success('Book added to wishlist');
  }
};

// Remove book from wishlist
export const removeBookFromWishlist = (bookId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    dispatch(removeBookFromWishlistSuccess(bookId));
    toast.success('Book removed from wishlist');
  } catch (error) {
    dispatch(hasError(error));
    toast.error('Failed to remove book from wishlist');
  }
};

// Sync wishlist after user logs in
export const syncWishlistAfterLogin = (userId) => async (dispatch, getState) => {
  const state = getState();
  const localWishlist = state.wishlist.wishlist;  // Get wishlist from localStorage

  dispatch(startLoading());
  try {
    await apiService.post(`/wishlist/sync`, { userId, localWishlist });

    const response = await apiService.get(`/wishlist/${userId}`);
    dispatch(loadWishlistFromServer(response.data));  // Sync wishlist from server
    toast.success('Wishlist synced with server');
  } catch (error) {
    dispatch(hasError(error));
    toast.error('Failed to sync wishlist');
  }
};

// Clear wishlist from localStorage and server 
export const clearWishlistFromServer = (userId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await apiService.delete(`/wishlist/${userId}`);  // Clear wishlist from server
    dispatch(clearWishlist());  // Clear local wishlist
    toast.success('Wishlist cleared');
  } catch (error) {
    dispatch(hasError(error));
    toast.error('Failed to clear wishlist');
  }
};

export default wishlistSlice.reducer;
