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
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import store from "../app/store";

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
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
    default:
      return state;
  }
};

const setSession = (accessToken) => {
  if (accessToken) {
    // console.log("Setting session with token:", accessToken);
    window.localStorage.setItem("accessToken", accessToken);
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    // console.log("Clearing session...");
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
      // console.log("Initializing authentication...");

      const accessToken = window.localStorage.getItem("accessToken");
      // console.log("AccessToken from localStorage:", accessToken);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        // console.log("Valid token found, setting session.");

        const response = await apiService.get("/users/me");
        const user = response.data;

        // console.log("User fetched from API:", user);

        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: true, user },
        });

        reduxDispatch(loginSuccess(user));
      } else {
        console.warn("No valid token found, clearing session.");
        setSession(null);
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    } catch (err) {
      console.error("Error during authentication initialization:", err);

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
      // console.log("Starting login process...");
      const response = await apiService.post("/auth/login", { email, password });
      // console.log("Login response received:", response);

      const { user, accessToken } = response.data;

      if (!accessToken) {
        throw new Error("No access token returned from login API");
      }

      // console.log("Access token received:", accessToken);

      setSession(accessToken);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user },
      });

      reduxDispatch(loginSuccess(user));
      reduxDispatch(syncWishlistAfterLogin(user._id));
      reduxDispatch(syncCartAfterLogin(user._id));

      // console.log("Login process completed successfully.");
      if (callback) callback();
    } catch (error) {
      console.error("Error during login process:", error.message);
      toast.error("Login failed. Please try again.");
    }
  };

  const register = async ({ name, email, password }, callback) => {
    const response = await apiService.post("/users", {
      name,
      email,
      password,
    });

    const { user, accessToken } = response.data;
    setSession(accessToken);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { user },
    });

    callback();
  };

  const logout = async (wishlist, user, callback) => {
    try {
      // console.log("Starting logout process...");
      const token = localStorage.getItem("accessToken");
      // console.log("Token before logout:", token);

      setSession(null);
      // console.log(
      //   "Authorization Header after clearing:",
      //   apiService.defaults.headers.common.Authorization
      // );

      if (token && user) {
        try {
          await apiService.post(`/wishlist/sync`, {
            userId: user._id,
            localWishlist: wishlist,
          });
          // console.log("Wishlist synced successfully before logout.");
        } catch (error) {
          console.error("Error syncing wishlist:", error.message);
        }
        reduxDispatch(clearCartOnLogout());
      } else {
        console.warn("No token or user, skipping wishlist sync.");
      }

      try {
        await apiService.post(`/auth/logout`);
        // console.log("Successfully logged out from the server.");
      } catch (error) {
        console.warn("Server logout failed:", error.message);
      }

      reduxDispatch(logoutSuccess());
      // console.log("Redux state after logoutSuccess:", store.getState().user);

      await initialize();
      toast.success("Logged out successfully!");
      if (callback) callback();
    } catch (error) {
      console.error("Error during logout:", error.message);
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
