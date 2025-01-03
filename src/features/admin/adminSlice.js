import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";

// Async Thunks cho API

// Dashboard
export const fetchDashboardData = createAsyncThunk(
  "admin/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch dashboard data"
      );
    }
  }
);

// Thêm sách
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

// Lấy danh sách sách
export const fetchBooks = createAsyncThunk(
  "admin/fetchBooks",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiService.get(
        `/admin/books?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

// Xóa sách
export const deleteBook = createAsyncThunk(
  "admin/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      console.log(`Attempting to delete book with ID: ${bookId}`);

      const response = await apiService.delete(`/admin/books/${bookId}`);
      console.log(`Successfully deleted book with ID: ${bookId}`);

      return bookId;
    } catch (error) {
      console.error(`Error deleting book with ID: ${bookId}`, {
        errorResponse: error.response,
        errorMessage: error.message,
      });

      return rejectWithValue(
        error.response?.data?.message || "Failed to delete book"
      );
    }
  }
);

// Lấy danh sách sách đã xóa
export const fetchDeletedBooks = createAsyncThunk(
  "admin/fetchDeletedBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/admin/deleted-books");
      console.log("Deleted books fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching deleted books:", error.response || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deleted books"
      );
    }
  }
);


// Khôi phục sách đã xóa
export const restoreDeletedBook = createAsyncThunk(
  "admin/restoreDeletedBook",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        `/admin/deleted-books/restore/${bookId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to restore book"
      );
    }
  }
);

// Xóa sách vĩnh viễn
export const permanentlyDeleteBook = createAsyncThunk(
  "admin/permanentlyDeleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/admin/deleted-books/${bookId}`);
      return bookId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to permanently delete book"
      );
    }
  }
);

// Lấy danh sách danh mục
export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/categories/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);


export const updateBook = createAsyncThunk(
  "admin/updateBook",
  async ({ bookId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/admin/books/${bookId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update book"
      );
    }
  }
);


// Slice cho admin
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboard: null,
    books: {
      books: [],
      totalBooks: 0,
      totalPages: 0,
    },
    deletedBooks: [],
    categories: [],
    hasMore: true,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        const uniqueBooks = new Map();
        [...state.books.books, ...action.payload.books].forEach((book) => {
          uniqueBooks.set(book._id, book);
        });
        state.books.books = Array.from(uniqueBooks.values());
        state.books.totalBooks = action.payload.totalBooks;
        state.books.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.books.length > 0;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.books = state.books.books.filter(
          (book) => book._id !== action.payload
        );
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDeletedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeletedBooks.fulfilled, (state, action) => {
        console.log("Updating state with deleted books:", action.payload);
        state.loading = false;
        state.deletedBooks = action.payload; 
      })
      
      .addCase(fetchDeletedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(restoreDeletedBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreDeletedBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.books.push(action.payload);
        state.deletedBooks = state.deletedBooks.filter(
          (book) => book._id !== action.payload._id
        );
      })
      .addCase(restoreDeletedBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(permanentlyDeleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(permanentlyDeleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedBooks = state.deletedBooks.filter(
          (book) => book._id !== action.payload
        );
      })
      .addCase(permanentlyDeleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
