import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";


const initialState = {
  isLoading: false,
  isBookNotInCart: false,
  errors: null,
  cart: [],
  books: [],
  book: "",
  selectedBook: null,
  page: 1,
  limit: 9,
  search: "",
  searchInput: "",
  review: "",
  totalPages: 0,
  disableButtonSend: false,
  minPrice: 0,
  maxPrice: 50,
};

const bookSlice = createSlice({
    name: "book",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.books = [];
      state.book = "";
    },

    endLoading(state) {
      state.isLoading = false;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.errors = action.payload;
    },

    getBooksSuccess(state, action) {
      state.errors = null;
      state.books = action.payload.books;
      state.totalPages = action.payload.totalPages;
    },

    getBookDetailSuccess(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.book = action.payload;
    },

    getBookDetailAgain(state, action) {
      state.errors = null;
      state.book = action.payload;
    },

    changePage(state, action) {
      state.page = action.payload;
    },

    changeSearchInput(state, action) {
      state.isLoading = false;
      state.searchInput = action.payload;
    },

    changeKeyword(state, action) {
      state.isLoading = false;
      state.search = action.payload;
      state.page = 1; 
    },

    changeisBookNotInCart(state, action) {
      state.isBookNotInCart = action.payload;
    },

    getCart(state, action) {
      state.cart = action.payload;
    },

    changeReview(state, action) {
      state.review = action.payload;
    },

    setButtonSendTrue(state) {
      state.disableButtonSend = true;
    },

    setButtonSendFalse(state) {
      state.disableButtonSend = false;
    },

    changeMinPrice(state, action) {
      state.minPrice = action.payload;
    },

    changeMaxPrice(state, action) {
      state.maxPrice = action.payload;
    },


  }
})

//action
export const getBooks = (page, search, minPrice, maxPrice) => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    const response = await apiService.get(
      `/books?page=${page}&limit=${initialState.limit}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
    dispatch(bookSlice.actions.getBooksSuccess(response.data));
    dispatch(bookSlice.actions.endLoading());
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getSingleBook = (id, userId) => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    const response = await apiService.get(`/books/${id}`);
    const responseCart = await apiService.get(`/carts/${userId}`);
    dispatch(bookSlice.actions.getCart(responseCart.data));
    dispatch(bookSlice.actions.getBookDetailSuccess(response.data));
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getBookDetailAgain = (id) => async (dispatch) => {
  try {
    const response = await apiService.get(`/books/${id}`);
    dispatch(bookSlice.actions.getBookDetailAgain(response.data));
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const setiIsBookNotInCart = (value) => (dispatch) => {
  dispatch(bookSlice.actions.changeisBookNotInCart(value));
};


export const changePage = (page) => (dispatch) => {
  dispatch(bookSlice.actions.changePage(page));
};

export const changeSearchInput = (searchInput) => (dispatch) => {
  dispatch(bookSlice.actions.changeSearchInput(searchInput));
};


export const changeKeyword = (keyword) => (dispatch) => {
  dispatch(bookSlice.actions.changeKeyword(keyword));
};

export const changeReview = (review) => (dispatch) => {
  dispatch(bookSlice.actions.changeReview(review));
};

export const sendReview = (userId, name, bookId, review) => async (dispatch) => {
  dispatch(bookSlice.actions.setButtonSendTrue()); 

  if (!review) {
    toast.error("Review is null. Please enter a valid review.");
    dispatch(bookSlice.actions.setButtonSendFalse()); 
  } else {
    try {
      const reviewData = {
        name,
        bookId,
        comment: review,
      };
      
      await apiService.post(`/reviews/${userId}`, reviewData); 
      dispatch(bookSlice.actions.changeReview("")); 
      dispatch(bookSlice.actions.setButtonSendFalse()); 
      toast.success("Leave a review successfully"); 
    } catch (error) {
      dispatch(bookSlice.actions.hasError(error.message)); 
      toast.error(error.message); 
    }
  }
};

export const updateReview = (userId, data) => async (dispatch) => {
  try {
    const response = await apiService.put(`/reviews/${userId}`, data); 
    toast.success(response.message); 
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error.message)); 
    toast.error(error.message); 
  }
};

export const setButtonSendTrue = () => (dispatch) => {
  dispatch(bookSlice.actions.setButtonSendTrue());
};

export const setButtonSendFalse = () => (dispatch) => {
  dispatch(bookSlice.actions.setButtonSendFalse());
};

export const changeMinPrice = (minPrice) => (dispatch) => {
  dispatch(bookSlice.actions.changeMinPrice(minPrice));
};

export const changeMaxPrice = (maxPrice) => (dispatch) => {
  dispatch(bookSlice.actions.changeMaxPrice(maxPrice));
};


export default bookSlice.reducer;