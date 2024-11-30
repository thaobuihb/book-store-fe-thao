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
      const errorMessage = error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
      
      // Lưu tạm vào LocalStorage
      localStorage.setItem("orderDetails", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi tạo đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
      const errorMessage = error.response?.data?.message || "Lỗi khi hủy đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
      const errorMessage = error.response?.data?.message || "Lỗi khi lấy thông tin đơn hàng.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Xác nhận thanh toán đơn hàng (nếu cần)
export const confirmPayment = createAsyncThunk(
  "orders/confirmPayment",
  async ({ orderId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/orders/${orderId}/payment-status`, paymentDetails);
      toast.success("Thanh toán thành công!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Thanh toán thất bại.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
    // Xóa lỗi
    clearError(state) {
      state.error = null;
    },
    // Xóa thông tin đơn hàng
    clearOrderDetails(state) {
      state.orderDetails = null;
      localStorage.removeItem("orderDetails");
    },
    // Khôi phục thông tin đơn hàng từ LocalStorage
    restoreOrderDetails(state) {
      const savedOrder = localStorage.getItem("orderDetails");
      if (savedOrder) {
        state.orderDetails = JSON.parse(savedOrder);
      }
    },
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
        state.orderDetails = action.payload;
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
      })
      // confirmPayment
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        state.orderDetails = updatedOrder;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export reducers và actions
export const { clearError, clearOrderDetails, restoreOrderDetails } = orderSlice.actions;

export default orderSlice.reducer;
