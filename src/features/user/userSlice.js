import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  user: [],
  errors: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.errors = action.payload;
    },
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },
    changData(state, action) {
      state.user = action.payload;
    },
  },
});

export const getUser = (userId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/users/${userId}`);
    dispatch(slice.actions.getUserSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const updateUser = (userData, userId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await apiService.put(`/users/${userId}`, userData);
    toast.success("Update user profile successfully");
    const response = await apiService.get(`/users/${userId}`);
    dispatch(slice.actions.getUserSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export default slice.reducer;
