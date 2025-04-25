import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  errors: null,
  categories: [],
  popularCategories: [],
  selectedCategory: null,
  page: 1,
  limit: 9,
};

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, thunkAPI) => {
    try {
      const response = await apiService.get(`/categories`);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPopularCategories = createAsyncThunk(
  "category/getPopularCategories",
  async (_, thunkAPI) => {
    try {
      const response = await apiService.get(`/categories/popular`);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCategoryDetail = createAsyncThunk(
  "category/getCategoryDetail",
  async (id, thunkAPI) => {
    try {
      const response = await apiService.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    changePage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.categories = [];
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errors = null;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      .addCase(getPopularCategories.fulfilled, (state, action) => {
        state.popularCategories = action.payload;
        state.errors = null;
      })

      .addCase(getPopularCategories.rejected, (state, action) => {
        state.errors = action.payload;
      })

      .addCase(getCategoryDetail.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
        state.isLoading = false;
        state.errors = null;
      })

      .addCase(getCategoryDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export const { changePage } = categorySlice.actions;
export default categorySlice.reducer;
