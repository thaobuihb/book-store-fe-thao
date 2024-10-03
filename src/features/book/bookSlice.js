import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  isBookNotInCart: false,
  errors: null,
  cart: [],
  books: [],
  discountedBooks: [],
  newlyReleasedBooks: [],
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
  booksByCategory: [],
  categoryOfBooks:[],
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
    getDiscountedBooksSuccess(state, action) {
      state.discountedBooks = action.payload;
    },
    getNewlyReleasedBooksSuccess(state, action) {
      state.newlyReleasedBooks = action.payload;
    },

    getBooksByCategorySuccess(state, action) {
      state.booksByCategory = action.payload;
      state.errors = null;
    },

    getCategoryOfBooksSuccess(state, action) {
      state.categoryOfBooks = action.payload.categories;
      state.errors = null;
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
  },
});

// Action creators
export const getBooks = (page, search, minPrice, maxPrice, category) => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    const queryParams = new URLSearchParams({
      page: page || 1,
      search: search || "",
      minPrice: minPrice || 0,
      maxPrice: maxPrice || Number.MAX_SAFE_INTEGER,
      category: category || "",
    }).toString();

    console.log("Fetching books with URL:", `/books?${queryParams}`);
    
    const response = await apiService.get(`/books?${queryParams}`);
    
    console.log("Books API response:", response.data);
    dispatch(bookSlice.actions.getBooksSuccess(response.data));
    dispatch(bookSlice.actions.endLoading());
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getNewlyReleasedBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    const response = await apiService.get(`/books/new-released`);
    dispatch(bookSlice.actions.getNewlyReleasedBooksSuccess(response.data));
    dispatch(bookSlice.actions.endLoading());
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getDiscountedBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    const response = await apiService.get(`/books/discounted`);
    dispatch(bookSlice.actions.getDiscountedBooksSuccess(response.data));
    dispatch(bookSlice.actions.endLoading());
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getSingleBook = (id, userId) => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    // Gọi API lấy thông tin sách
    const bookResponse = await apiService.get(`/books/${id}`);
    console.log("Book Response:12345", bookResponse.data); // Kiểm tra phản hồi từ API
    dispatch(bookSlice.actions.getBookDetailSuccess(bookResponse.data));

    // Gọi API lấy thông tin giỏ hàng nếu có userId
    if (userId) {
      const cartResponse = await apiService.get(`/carts/${userId}`);
      dispatch(bookSlice.actions.getCart(cartResponse.data));
    }
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

export const sendReview =
  (userId, name, bookId, review) => async (dispatch) => {
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

export const getBooksByCategory = (categoryId) => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    const response = await apiService.get(`/books/category/${categoryId}`);
    console.log("%%%%%%", response.data)
    dispatch(bookSlice.actions.getBooksByCategorySuccess(response.data));
    dispatch(bookSlice.actions.endLoading());
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getCategoryOfBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.startLoading());
  try {
    const response = await apiService.get('books/categories');
    dispatch(bookSlice.actions.getCategoryOfBooksSuccess(response.data));
    console.log("56789", response)
  } catch (error) {
    dispatch(bookSlice.actions.hasError(error));
    toast.error(error.message);
  } finally {
    dispatch(bookSlice.actions.endLoading()); 
  }
};

export default bookSlice.reducer;
