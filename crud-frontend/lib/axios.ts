// lib/axios.ts

import axios from "axios";
import { getToken } from "./auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
});

// ✅ แนบ Token ทุก Request อัตโนมัติ
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 — Token หมดอายุ
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token หมดอายุ → Logout + Redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;