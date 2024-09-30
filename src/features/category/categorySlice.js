import { createSlice } from "@reduxjs/toolkit";
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.categories = [];
    },
    endLoading(state) {
      state.isLoading = false;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.errors = action.payload;
    },
    getCategoriesSuccess(state, action) {
      state.errors = null;
      state.categories = action.payload; 
    },
    getPopularCategoriesSuccess(state, action) {
      state.errors = null;
      state.popularCategories = action.payload; 
    },
    getCategoryDetailSuccess(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.selectedCategory = action.payload; 
    },
    changePage(state, action) {
      state.page = action.payload; // Thay đổi trang
    },
  },
});

// Action creators
export const getCategories = () => async (dispatch) => {
  dispatch(categorySlice.actions.startLoading());
  try {
    const response = await apiService.get(`/categories`);
    dispatch(categorySlice.actions.getCategoriesSuccess(response.data));
    dispatch(categorySlice.actions.endLoading());
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getPopularCategories = () => async (dispatch) => {
  dispatch(categorySlice.actions.startLoading());
  try {
    const response = await apiService.get(`/categories/popular`);
    dispatch(categorySlice.actions.getPopularCategoriesSuccess(response.data));
    dispatch(categorySlice.actions.endLoading());
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getCategoryDetail = (id) => async (dispatch) => {
  dispatch(categorySlice.actions.startLoading());
  try {
    const response = await apiService.get(`/categories/${id}`);
    dispatch(categorySlice.actions.getCategoryDetailSuccess(response.data));
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const changePage = (page) => (dispatch) => {
  dispatch(categorySlice.actions.changePage(page));
};

export default categorySlice.reducer;
