import axios from "axios";
import { userStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.MODE === "production" ? "/api" : "http://localhost:5001/api",
  withCredentials: true, // Tự động gửi Cookie refreshToken
});

// 1. Request Interceptor: Gửi accessToken
api.interceptors.request.use((config) => {
  const token = userStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Tự động xin accessToken mới khi bị lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Chỉ thử refresh nếu là lỗi 401 VÀ chưa thử lại VÀ KHÔNG PHẢI request refresh token
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        userStore.setState({ accessToken: newAccessToken });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Chỉ đá về trang signin khi Refresh Token THỰC SỰ thất bại
        console.error("Refresh token thất bại, đăng nhập lại.");
        userStore.setState({ accessToken: null, user: null });
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;