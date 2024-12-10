import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";


// Tạo đơn hàng cho người dùng đã đăng nhập
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, orderData }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/orders/${userId}`, orderData);
      toast.success("Đơn hàng đã được tạo thành công!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi tạo đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Tạo đơn hàng cho người dùng không đăng nhập
export const createGuestOrder = createAsyncThunk(
  "orders/createGuestOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/orders/guest`, orderData);
      toast.success("Đơn hàng đã được tạo thành công!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi tạo đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy danh sách đơn hàng của người dùng
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/orders/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy chi tiết một đơn hàng
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async ({ userId, orderId }, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/orders/${userId}/${orderId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi lấy thông tin đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Cập nhật trạng thái đơn hàng (hủy đơn hàng)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ userId, orderId, status }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/orders/${userId}/${orderId}`, { status });
      toast.success("Trạng thái đơn hàng đã được cập nhật!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi cập nhật trạng thái đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPurchaseHistory = createAsyncThunk(
  "orders/fetchPurchaseHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/orders/purchase-history/${userId}`);
      console.log("API response for purchase history:%%%%%%%%%%", response.data);

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch purchase history");
    }
  }
);


// Khởi tạo slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderDetails: null,
    purchaseHistory: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearOrderDetails(state) {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createGuestOrder
      .addCase(createGuestOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGuestOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload);
      })
      .addCase(createGuestOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // 
    .addCase(fetchPurchaseHistory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchPurchaseHistory.fulfilled, (state, action) => {
      console.log("Purchase history data fetched:!!!!!!", action.payload);

      state.isLoading = false;
      state.purchaseHistory = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase(fetchPurchaseHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

// Export reducers và actions
export const { clearError, clearOrderDetails } = orderSlice.actions;

export default orderSlice.reducer;
