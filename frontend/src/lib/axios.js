import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === "production" ? "/api" : "http://localhost:5001/api",
  withCredentials: true, // Tự động gửi Cookie refreshToken
});

// Getter/setter lazy để tránh circular dependency (ESM không dùng require)
let _getToken = null;
let _setToken = null;
export const setTokenGetter = (fn) => { _getToken = fn; };
export const setTokenSetter = (fn) => { _setToken = fn; };

// Tự động đính kèm accessToken vào mọi request
api.interceptors.request.use((config) => {
  const token = _getToken?.();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Tự động refresh accessToken khi nhận 401
api.interceptors.response.use(
  (response) => response, // response OK → trả thẳng
  async (error) => {
    const originalRequest = error.config;

    // Nếu 401 VÀ chưa retry (tránh vòng lặp vô tận)
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        // Gọi refresh token — cookie refreshToken tự động đính kèm
        const res = await api.post("/auth/refreshtoken");
        const newToken = res.data.accessToken;

        // Lưu token mới vào store
        _setToken?.(newToken);

        // Đính kèm token mới vào request cũ rồi retry
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh cũng thất bại → session thực sự hết hạn, clear store
        _setToken?.(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;