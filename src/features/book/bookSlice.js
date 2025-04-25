// 📦 Redux Toolkit refactor hoàn chỉnh cho bookSlice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  isBookNotInCart: false,
  bookLoaded: false,
  errors: null,
  cart: [],
  books: [],
  discountedBooks: [],
  newlyReleasedBooks: [],
  bestSellerBooks: [],
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
  categoryOfBooks: [],
};

export const getBooks = createAsyncThunk(
  "book/getBooks",
  async (
    {
      page = 1,
      search = "",
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      category = "",
    },
    thunkAPI
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 14,
        search,
        minPrice,
        maxPrice,
        category,
      }).toString();
      const response = await apiService.get(`/books?${queryParams}`);
      return response.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getBookWithCategory = createAsyncThunk(
  "book/getBookWithCategory",
  async (bookId, thunkAPI) => {
    try {
      const bookRes = await apiService.get(`/books/${bookId}`);
      const book = bookRes.data;
      if (!book.category)
        throw new Error("Category ID not found for the selected book.");
      const relatedRes = await apiService.get(
        `/books/category/${book.category}`
      );
      return { book: book, relatedBooks: relatedRes.data };
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getNewlyReleasedBooks = createAsyncThunk(
  "book/getNewlyReleasedBooks",
  async (_, thunkAPI) => {
    try {
      const res = await apiService.get(`/books/new-released`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getDiscountedBooks = createAsyncThunk(
  "book/getDiscountedBooks",
  async (_, thunkAPI) => {
    try {
      const res = await apiService.get(`/books/discounted`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getBooksByCategory = createAsyncThunk(
  "book/getBooksByCategory",
  async (categoryId, thunkAPI) => {
    try {
      const res = await apiService.get(`/books/category/${categoryId}`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCategoryOfBooks = createAsyncThunk(
  "book/getCategoryOfBooks",
  async (_, thunkAPI) => {
    try {
      const res = await apiService.get(`/books/categories`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getBestSellerBooks = createAsyncThunk(
  "book/getBestSellerBooks",
  async (_, thunkAPI) => {
    try {
      const res = await apiService.get(`/books/best-seller`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sendReview = createAsyncThunk(
  "book/sendReview",
  async ({ userId, name, bookId, review }, thunkAPI) => {
    try {
      if (!review)
        throw new Error("Review is null. Please enter a valid review.");
      await apiService.post(`/reviews/${userId}`, {
        name,
        bookId,
        comment: review,
      });
      toast.success("Review submitted successfully");
      return "success";
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  "book/updateReview",
  async ({ userId, data }, thunkAPI) => {
    try {
      const res = await apiService.put(`/reviews/${userId}`, data);
      toast.success(res.message);
      return res.message;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    changePage: (state, action) => void (state.page = action.payload),
    changeSearchInput: (state, action) =>
      void (state.searchInput = action.payload),
    changeKeyword: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    changeisBookNotInCart: (state, action) =>
      void (state.isBookNotInCart = action.payload),
    getCart: (state, action) => void (state.cart = action.payload),
    changeReview: (state, action) => void (state.review = action.payload),
    setButtonSendTrue: (state) => void (state.disableButtonSend = true),
    setButtonSendFalse: (state) => void (state.disableButtonSend = false),
    changeMinPrice: (state, action) => void (state.minPrice = action.payload),
    changeMaxPrice: (state, action) => void (state.maxPrice = action.payload),
    getBookDetailAgain: (state, action) => void (state.book = action.payload),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => void (state.isLoading = true))
      .addCase(getBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errors = null;
        state.books = action.payload.books;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })

      .addCase(getBookWithCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookLoaded = true;
        state.book = action.payload.book;
        state.booksByCategory = action.payload.relatedBooks;
      })

      .addCase(getNewlyReleasedBooks.fulfilled, (state, action) => {
        state.newlyReleasedBooks = action.payload;
      })

      .addCase(getDiscountedBooks.fulfilled, (state, action) => {
        state.discountedBooks = action.payload;
      })

      .addCase(getBooksByCategory.fulfilled, (state, action) => {
        state.booksByCategory = action.payload;
      })

      .addCase(getCategoryOfBooks.fulfilled, (state, action) => {
        state.categoryOfBooks = action.payload.categories;
      })

      .addCase(getBestSellerBooks.fulfilled, (state, action) => {
        state.bestSellerBooks = action.payload;
      })

      .addCase(sendReview.fulfilled, (state) => {
        state.review = "";
        state.disableButtonSend = false;
      })

      .addCase(sendReview.rejected, (state) => {
        state.disableButtonSend = false;
      });
  },
});

export const {
  changePage,
  changeSearchInput,
  changeKeyword,
  changeisBookNotInCart,
  getCart,
  changeReview,
  setButtonSendTrue,
  setButtonSendFalse,
  changeMinPrice,
  changeMaxPrice,
  getBookDetailAgain,
} = bookSlice.actions;

export default bookSlice.reducer;
