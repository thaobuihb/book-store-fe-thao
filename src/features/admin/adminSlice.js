import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";

// Async Thunks cho API


// Them sach
export const createBook = createAsyncThunk(
  "admin/createBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await apiService.post("/books", bookData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create book"
      );
    }
  }
);

export const fetchBooks = createAsyncThunk(
  "admin/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/admin/books");
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  "admin/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/admin/books/${bookId}`);
      return bookId; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete book"
      );
    }
  }
);


// Fetch categories
export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/category/");
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Slice cho admin
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // them sach
    builder
      // Thêm sách
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Fetch Books
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Book
    builder
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      //Fetch book
      builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; 
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
