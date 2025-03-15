import { createContext, useReducer, useEffect } from "react";
import apiService from "../app/apiService";
import { isValidToken } from "../utils/jwt";
import {
  syncWishlistAfterLogin,
  clearWishlist,
} from "../features/wishlist/wishlistSlice";
import {
  syncCartAfterLogin,
  clearCartOnLogout,
} from "../features/cart/cartSlice";
import { loginSuccess, logoutSuccess } from "../features/user/userSlice";
import { clearSearchResult } from "../features/order/orderSlice";
import { fetchPurchaseHistory } from "../features/order/orderSlice";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
const REGISTER_FAIL = "REGISTER_FAIL";
const LOGOUT = "AUTH.LOGOUT";

const reducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isInitialized: true,
        isAuthenticated,
        user,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
      case REGISTER_FAIL:
            return {
                ...state,
                error: action.payload
            };
    default:
      return state;
  }
};

const setSession = (accessToken) => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService.defaults.headers.common.Authorization;
  }
};

const AuthContext = createContext({ ...initialState });

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();

  const initialize = async () => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
  
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
  
        const response = await apiService.get("/users/me");
        const user = response.data;

        console.log("Initialized User:", user);
  
        // Kiểm tra role của user
        if (!user.role) {
          throw new Error("User role is missing");
        }
  
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: true, user },
        });
  
        reduxDispatch(loginSuccess(user));
      } else {
        setSession(null);
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    } catch (err) {
      console.error("Error during initialization:", err.message);
      setSession(null);
      dispatch({
        type: INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };
  

  useEffect(() => {
    initialize();
  }, [reduxDispatch]);

  const login = async ({ email, password }, callback) => {
    try {
      const response = await apiService.post("/auth/login", { email, password });
      const { user, accessToken } = response.data;

      console.log("Login response:", user); 

      if (!accessToken) {
        throw new Error("No access token returned from login API");
      }

      setSession(accessToken);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user },
      });

      reduxDispatch(loginSuccess(user));
      setTimeout(() => {
        reduxDispatch(fetchPurchaseHistory(user._id)); 
        reduxDispatch(syncWishlistAfterLogin(user._id));
        reduxDispatch(syncCartAfterLogin(user._id));
      }, 500); 
      if (callback) callback();
      return user;
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };


  const register = async ({ name, email, password }, callback) => {
    try {
      const response = await apiService.post("/users", { name, email, password });
  
      if (!response.data || !response.data.accessToken) {
        throw new Error("Invalid response from server");
      }
  
      const { user, accessToken } = response.data;
  
      // Lưu token vào session/localStorage
      setSession(accessToken);
  
      // Cập nhật AuthContext
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { user },
      });
  
      // Cập nhật Redux ngay lập tức
      reduxDispatch(loginSuccess(user));
  
      setTimeout(() => {
        reduxDispatch(fetchPurchaseHistory(user._id)); 
        reduxDispatch(syncWishlistAfterLogin(user._id));
        reduxDispatch(syncCartAfterLogin(user._id));
      }, 500); 

      toast.success("Đăng ký thành công!");
  
      // Gọi callback khi đã hoàn tất
      if (typeof callback === "function") {
        callback(null);
      }
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response?.data?.message || "Đăng ký thất bại",
      });
  
      if (typeof callback === "function") {
        callback(error);
      }
    }
  };
  
  

  const logout = async (wishlist, user, callback) => {
    try {
      const token = localStorage.getItem("accessToken");

      setSession(null);

      if (token && user) {
        try {
          await apiService.post(`/wishlist/sync`, {
            userId: user._id,
            localWishlist: wishlist,
          });
        } catch (error) {
          console.error("Error syncing wishlist:", error.message);
        }
        reduxDispatch(clearCartOnLogout());
      }

      try {
        await apiService.post(`/auth/logout`);
      } catch (error) {
        console.warn("Server logout failed:", error.message);
      }

      reduxDispatch(logoutSuccess());
      reduxDispatch(clearSearchResult());
      await initialize();
      toast.success("Logged out successfully!");
      if (callback) callback();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      if (callback) callback();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, setSession };
