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
      console.log("📦 Dữ liệu chuẩn bị gửi lên server:", bookData);

      const clientErrors = {};
      if (!bookData.name?.trim()) clientErrors.name = "Tên sách là bắt buộc";

      const price = Number(bookData.price);
      if (isNaN(price) || price < 0) {
        clientErrors.price = "Giá sách phải là một số hợp lệ";
      }

      if (!bookData.publicationDate) {
        clientErrors.publicationDate = "Ngày xuất bản là bắt buộc";
      }

      if (!bookData.categoryId?.trim()) {
        clientErrors.categoryId = "Danh mục là bắt buộc";
      }

      if (!bookData.author?.trim()) clientErrors.author = "Tác giả là bắt buộc";

      if (Object.keys(clientErrors).length > 0) {
        return rejectWithValue({
          message: "Validation Error",
          errors: clientErrors,
        });
      }

      const sanitizedBookData = {
        ...bookData,
        price,
        discountRate: Math.max(0, Number(bookData.discountRate || 0)),
      };

      const response = await apiService.post("/books", sanitizedBookData);
      console.log("✅ Phản hồi từ server:", response.data);
      return response.data;

    } catch (error) {
      console.error("🧨 Full lỗi từ server:", error?.response?.data);

      return rejectWithValue(
        error?.response?.data?.errors
          ? error.response.data
          : {
              message:
                error?.response?.data?.message ||
                error.message ||
                "Lỗi không xác định từ máy chủ",
            }
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
      console.error(
        "Error fetching deleted books:",
        error.response || error.message
      );
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
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/orders");
      const orders = response.data.map((order) => ({
        ...order,
        orderCode: order.orderCode || "Không có mã đơn hàng",
        customerEmail: order.userId?.email || order.guestEmail || "Không có email",
        books: order.books.map((book) => ({
          ...book,
          quantity: book.quantity || 1,
        })),
      }));
      return orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Cập nhật trạng thái giao hàng
export const updateOrderShippingStatus = createAsyncThunk(
  "admin/updateOrderShippingStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/orders/admin/${orderId}`, {
        status: orderStatus,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update shipping status"
      );
    }
  }
);

// Cập nhật trạng thái thanh toán
export const updateOrderPaymentStatus = createAsyncThunk(
  "admin/updateOrderPaymentStatus",
  async ({ orderId, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(
        `/orders/${orderId}/payment-status`,
        { paymentStatus }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update payment status"
      );
    }
  }
);

// Cập nhật địa chỉ giao hàng
export const updateShippingAddress = createAsyncThunk(
  "admin/updateShippingAddress",
  async ({ orderId, shippingAddress }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(
        `/orders/${orderId}/shipping-address`,
        { shippingAddress }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update shipping address"
      );
    }
  }
);

// huỷ đơn hàng
export const cancelOrder = createAsyncThunk(
  "admin/cancelOrder",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/orders/${orderId}`, {
        status: "Đã hủy", // Trạng thái hủy
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

// Xóa đơn hàng (nếu cần thiết)
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

//lấy người dùng
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/users");
      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      throw new Error("Invalid API response format");
    } catch (error) {
      console.error("Error fetching users:", error.message || error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// thêm người dùng
export const addManager = createAsyncThunk(
  "admin/addManager",
  async (newManager, { rejectWithValue }) => {
    try {
      const response = await apiService.post("/users/admin", newManager);
      return response.data;
    } catch (error) {
      console.error("🔥 Lỗi từ Axios:", error);

      if (error.response) {
        console.error("🔥 Full Response status:", error.response.status);
        console.error("🔥 Error Data:", JSON.stringify(error.response.data, null, 2));
        
        // Return the complete error response data object
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error("🔥 Lỗi request nhưng không có phản hồi từ backend");
        return rejectWithValue({ success: false, message: "Không thể kết nối đến server!" });
      } else {
        console.error("🔥 Lỗi không xác định:", error.message);
        return rejectWithValue({ success: false, message: error.message || "Lỗi không xác định từ Redux!" });
      }
    }
  }
);

// cập nhật thông tin người dùng
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/users/${userId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error in updateUser API call:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

//Xoá người dùng
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "admin/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      console.log("🚀 Gửi request tới server:", categoryData);
      const response = await apiService.post("/categories", categoryData);
      console.log("✅ Response từ server:", response);
      return response.data;
    } catch (error) {
      console.error("🔥 Lỗi từ Axios:", error);

      if (error.response) {
        console.error("🔥 Full Response status:", error.response.status);
        console.error("🔥 Error Data:", JSON.stringify(error.response.data, null, 2));
        
        // Return the complete error response data object
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error("🔥 Lỗi request nhưng không có phản hồi từ backend");
        return rejectWithValue({ success: false, message: "Không thể kết nối đến server!" });
      } else {
        console.error("🔥 Lỗi không xác định:", error.message);
        return rejectWithValue({ success: false, message: error.message || "Lỗi không xác định từ Redux!" });
      }
    }
  }
);
//Lấy category
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

//sửa category
export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ categoryId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(
        `/categories/${categoryId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

//xoá danh mục
export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
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
    orders: [],
    users: [],
    hasMore: true,
    loading: false,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

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
      // Thêm danh mục

      .addCase(addCategory.pending, (state) => {
        // console.log("🚀 Redux: addCategory pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        // console.log("✅ Redux: addCategory fulfilled");
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        console.log("🔥 Rejected action payload:", JSON.stringify(action.payload, null, 2));
        
        if (typeof action.payload === 'object') {
          state.error = action.payload.message || "Unknown Error 123";
        } else if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = action.error?.message || "Unknown Error 123";
        }
      })
      //lấy danh mục
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sửa danh mục
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload;
        state.categories = state.categories.map((category) =>
          category._id === updatedCategory._id ? updatedCategory : category
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Xóa danh mục
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
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

      // Xử lý trạng thái giao hàng
      .addCase(updateOrderShippingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderShippingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderShippingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Xử lý trạng thái thanh toán
      .addCase(updateOrderPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Cập nhật địa chỉ giao hàng
      .addCase(updateShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingAddress.fulfilled, (state, action) => {
        state.loading = false;

        // Cập nhật địa chỉ giao hàng
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xoá đơn hàng
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //lấy người dùng
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Thêm manager
      .addCase(addManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addManager.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [...state.users, action.payload];
        state.error = null;
      })
      .addCase(addManager.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === 'object') {
          state.error = action.payload.message || "Unknown Error";
        } else if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else {
          state.error = action.error?.message || "Unknown Error";
        }
      })
      //cập nhật thông tin người dùng
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload;
        if (updatedUser && updatedUser._id) {
          state.users = state.users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          );
        } else {
          console.error(
            "Invalid payload in updateUser action:",
            action.payload
          );
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      })
      //xoá người dùng
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.payload;
        state.users = state.users.filter((user) => user._id !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
