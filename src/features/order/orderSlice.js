import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../app/apiService"; 
import { toast } from "react-toastify";

// Async thunks cho các hành động liên quan đến đơn hàng

// Lấy danh sách đơn hàng của người dùng
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/orders/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Tạo một đơn hàng mới
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, orderData }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/orders/${userId}`, orderData);
      toast.success("Đơn hàng đã được tạo thành công!");
      return response.data;
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng.");
      return rejectWithValue(error.response.data);
    }
  }
);

// Hủy một đơn hàng
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ userId, orderId }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/orders/${userId}/${orderId}`, { status: "Cancelled" });
      toast.success("Đơn hàng đã bị hủy!");
      return response.data;
    } catch (error) {
      toast.error("Lỗi khi hủy đơn hàng.");
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy chi tiết đơn hàng
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async ({ userId, orderId }, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/orders/${userId}/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Khởi tạo slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderDetails: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Các reducers đồng bộ khác nếu cần
  },
  extraReducers: (builder) => {
    builder
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
      // cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, status: "Cancelled" } : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
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
      });
  },
});

export default orderSlice.reducer;
