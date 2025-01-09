import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";


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
      console.log("Dữ liệu chuẩn bị gửi lên server:", bookData);  // Thêm log kiểm tra

      // Kiểm tra dữ liệu đầu vào
      if (!bookData.name || !bookData.price || !bookData.publicationDate || !bookData.categoryId) {
        return rejectWithValue("Thiếu thông tin bắt buộc: Tên, Giá, Ngày xuất bản, Danh mục");
      }

      // Đảm bảo price và discountRate không âm
      const sanitizedBookData = {
        ...bookData,
        price: Math.max(0, bookData.price),
        discountRate: Math.max(0, bookData.discountRate || 0),
      };

      const response = await apiService.post("/books", sanitizedBookData);
      console.log("Phản hồi từ server:", response.data);
      return response.data;
    } catch (error) {
      console.error("Chi tiết lỗi từ server:", error.response?.data);
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

// Cập nhật sách
export const updateBook = createAsyncThunk(
  "admin/updateBook",
  async ({ bookId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/books/${bookId}`, updatedData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update book"
      );
    }
  }
);


// Fetch tất cả đơn hàng
export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// Update trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, updatedStatus }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/orders/${orderId}`, { status: updatedStatus });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

// Xóa đơn hàng (nếu cần thiết)
export const deleteOrder = createAsyncThunk(
  'admin/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete order");
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
    orders: [],
    hasMore: true,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
    //dashboroard
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
// tạo mới
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
//lấy sách
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
//xoá
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
//lấy sách đã xoá
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
//lấy lại sách đã xoá
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
//xoá luôn
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
//lấy danh mục
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
      })
      // cập nhật
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.books.books.findIndex(
          (book) => book._id === action.payload._id
        );
        if (updatedIndex !== -1) {
          state.books.books[updatedIndex] = action.payload;
        }
        toast.success("Cập nhật sách thành công!");
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(`Cập nhật thất bại: ${action.payload}`);
      })
      //Đơn hàng
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Cập nhật trạng thái đơn hàng
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xoá đơn hàng
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default adminSlice.reducer;
