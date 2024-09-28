import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookReducer from "../features/book/bookSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import adminReducer from "../features/admin/adminSlice";
import userReducer from "../features/user/userSlice";
import categoryReducer from "../features/category/categorySlice"
const rootReducer = combineReducers({
  book: bookReducer,
  cart: cartReducer,
  order: orderReducer,
  wishlist: wishlistReducer,
  user: userReducer,
  admin: adminReducer,
  category: categoryReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
