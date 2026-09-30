import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === "production" ? "/api" : "http://localhost:5001/api",
  withCredentials: true, // Tự động gửi Cookie refreshToken
});

// Getter lazy để tránh circular dependency (ESM không dùng require)
let _getToken = null;
export const setTokenGetter = (fn) => { _getToken = fn; };

// Tự động đính kèm accessToken vào mọi request
api.interceptors.request.use((config) => {
  const token = _getToken?.();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;