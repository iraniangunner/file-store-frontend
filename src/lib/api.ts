import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://componentland.ir/api", // وقتی هاست شدی اینو عوض می‌کنی
  headers: {
    "Content-Type": "application/json",
  },
});

// Middleware برای اضافه کردن Token
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
