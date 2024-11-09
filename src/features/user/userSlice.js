import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../app/apiService';
import { toast } from 'react-toastify';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isUpdateSuccess: false,
};

export const getCurrentUserProfile = createAsyncThunk(
  'user/getCurrentUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/users/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updatedData, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().user;
      const response = await apiService.put(`/users/${user._id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    resetUpdateStatus(state) {
      state.isUpdateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isUpdateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.isLoading = false;
        state.isUpdateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isUpdateSuccess = false;
      });
  },
});

export const { loginSuccess, logoutSuccess, resetUpdateStatus } = userSlice.actions;
export default userSlice.reducer;
