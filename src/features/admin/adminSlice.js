import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";

// ✅ Lấy dữ liệu dashboard
export const fetchDashboardData = createAsyncThunk(
  "admin/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch dashboard data");
    }
  }
);

// ✅ Thêm sách mới
export const createBook = createAsyncThunk(
  "admin/createBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await apiService.post("/books", bookData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create book");
    }
  }
);

// ✅ Lấy danh sách sách
export const fetchBooks = createAsyncThunk(
  "admin/fetchBooks",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/admin/books?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch books");
    }
  }
);

// ✅ Xóa sách (soft delete)
export const deleteBook = createAsyncThunk(
  "admin/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/admin/books/${bookId}`);
      return bookId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete book");
    }
  }
);

// ✅ Lấy danh sách sách đã xóa
export const fetchDeletedBooks = createAsyncThunk(
  "admin/fetchDeletedBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/admin/deleted-books");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch deleted books");
    }
  }
);

// ✅ Khôi phục sách đã xóa
export const restoreDeletedBook = createAsyncThunk(
  "admin/restoreDeletedBook",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/admin/deleted-books/restore/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to restore book");
    }
  }
);

// ✅ Xóa sách vĩnh viễn
export const permanentlyDeleteBook = createAsyncThunk(
  "admin/permanentlyDeleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/admin/deleted-books/${bookId}`);
      return bookId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to permanently delete book");
    }
  }
);

// ✅ Cập nhật sách
export const updateBook = createAsyncThunk(
  "admin/updateBook",
  async ({ bookId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/admin/books/${bookId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update book");
    }
  }
);

// ✅ Lấy danh mục sách
export const fetchCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/categories/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// ✅ Slice quản lý trạng thái admin
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
      // Dashboard
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Thêm sách
      .addCase(createBook.fulfilled, (state, action) => {
        state.books.books.push(action.payload);
      })

      // Lấy sách
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books.books = action.payload.books;
        state.books.totalBooks = action.payload.totalBooks;
        state.books.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.books.length > 0;
      })

      // Cập nhật sách
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.books.findIndex(book => book._id === action.payload._id);
        if (index !== -1) {
          state.books.books[index] = action.payload;
        }
      })

      // Xóa sách tạm thời
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books.books = state.books.books.filter(book => book._id !== action.payload);
      })

      // Lấy sách đã xóa
      .addCase(fetchDeletedBooks.fulfilled, (state, action) => {
        state.deletedBooks = action.payload;
      })

      // Khôi phục sách
      .addCase(restoreDeletedBook.fulfilled, (state, action) => {
        state.books.books.push(action.payload);
        state.deletedBooks = state.deletedBooks.filter(book => book._id !== action.payload._id);
      })

      // Xóa vĩnh viễn sách
      .addCase(permanentlyDeleteBook.fulfilled, (state, action) => {
        state.deletedBooks = state.deletedBooks.filter(book => book._id !== action.payload);
      })

      // Lấy danh mục
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Xử lý lỗi chung
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Xử lý trạng thái chung
      .addMatcher(
        (action) => action.type.endsWith("pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      );
  },
});

export default adminSlice.reducer;
