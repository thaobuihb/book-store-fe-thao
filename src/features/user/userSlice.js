
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../app/apiService';
// import { toast } from 'react-toastify';
// import { clearSearchResult } from '../order/orderSlice';

const initialState = {
  user: null,
  resetUrl: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isUpdateSuccess: false,
  isForgotSuccess: false,
  isResetSuccess: false,
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

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const res = await apiService.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Something went wrong');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await apiService.post('/auth/reset-password', { token, password });
      return res.data;
    } catch (error) {
      return rejectWithValue({ success: false, message: error.message || "Lỗi không xác định từ Redux!" });
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
    logoutSuccess(state,) {
      state.user = null;
      state.isAuthenticated = false;
    },
    resetUpdateStatus(state) {
      state.isUpdateSuccess = false;
    },
    resetAuthStatus(state) {
      state.error = null;
      state.isForgotSuccess = false;
      state.isResetSuccess = false;
      state.resetUrl = null;
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
      })
      // Forgot Password
  .addCase(forgotPassword.pending, (state) => {
    state.isLoading = true;
    state.error = null;
    state.isForgotSuccess = false;
  })
  .addCase(forgotPassword.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isForgotSuccess = true;
    state.resetUrl = action.payload?.resetUrl || null;  
  })
  .addCase(forgotPassword.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.isForgotSuccess = false;
  })

  // Reset Password
  .addCase(resetPassword.pending, (state) => {
    state.isLoading = true;
    state.error = null;
    state.isResetSuccess = false;
  })
  .addCase(resetPassword.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isResetSuccess = true;
  })
  .addCase(resetPassword.rejected, (state, action) => {
    state.isLoading = false;
    state.isResetSuccess = false;
  
    console.log("❌ Reset Password Error Payload:", JSON.stringify(action.payload, null, 2));
  
    if (typeof action.payload === 'object') {
      state.error = action.payload.message || "Unknown Error";
    } else if (typeof action.payload === 'string') {
      state.error = action.payload;
    } else {
      state.error = action.error?.message || "Unknown Error";
    }
  });
  
  },
});

export const { loginSuccess, logoutSuccess, resetUpdateStatus, resetAuthStatus, } = userSlice.actions;
export default userSlice.reducer;
