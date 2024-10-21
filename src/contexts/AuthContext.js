import { createContext, useReducer, useEffect } from "react";
import apiService from "../app/apiService";
import { isValidToken } from "../utils/jwt";
import { syncWishlistAfterLogin, clearWishlist } from "../features/wishlist/wishlistSlice";
import { loginSuccess, logoutSuccess } from "../features/user/userSlice";
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await apiService.get("/users/me");
          const user = response.data;

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
        console.error(err);

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

    initialize();
  }, []);

  const login = async ({ email, password }, callback) => {
    const response = await apiService.post("/auth/login", { email, password });
    const { user, accessToken } = response.data;
  
    setSession(accessToken);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user },
    });
  
    reduxDispatch(loginSuccess(user));
    reduxDispatch(syncWishlistAfterLogin(user._id));
  
    callback();
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
      const token = localStorage.getItem("accessToken");
      if (token && user && wishlist.length > 0) {
        try {
          await apiService.post(`/wishlist/sync`, {
            userId: user._id,
            localWishlist: wishlist,
          });
          console.log("Wishlist synced successfully before logout.");
        } catch (error) {
          console.error("Lỗi khi đồng bộ wishlist trước khi logout:", error.response ? error.response.data : error.message);
        }
      } else {
        console.warn("No token or userId, skipping wishlist sync during logout.");
      }
  
      // Xóa session sau khi đồng bộ hoàn tất
      setSession(null);
      reduxDispatch(logoutSuccess());
  
      toast.success("Đăng xuất thành công!");
  
      // Gọi callback để hoàn tất đăng xuất
      if (callback) callback();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error.message);
      toast.error("Đăng xuất không thành công");
  
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

export { AuthContext, AuthProvider };
