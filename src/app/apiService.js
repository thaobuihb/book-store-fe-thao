import axios from "axios";
import { BASE_URL } from "./config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: { 
    "Content-Type": "application/json", 
    "Accept": "application/json" 
  },
});

apiService.interceptors.request.use(
  (request) => {
    console.log("Request Headers after logout:", request.headers);
    // Không thêm Authorization cho các API công khai
    const publicEndpoints = ["/orders/guest"];
    if (publicEndpoints.some((endpoint) => request.url.includes(endpoint))) {
      delete request.headers.Authorization;
    } else {
      const token = localStorage.getItem("accessToken");
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }

    return request;
  },
  (error) => {
    console.error("REQUEST ERROR", error);
    return Promise.reject(error);
  }
);


apiService.interceptors.response.use(
  (response) => {
    console.log("Response", response); 
    return response.data;
  },
  function (error) {
    console.log("RESPONSE ERROR", { error });
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.response?.data?.errors?.[0]?.msg || 
      error.response?.data?.errors?.message ||
      error.message ||
      "Unknown Error";
    return Promise.reject({ success: false, message });
  }
);

export default apiService;
