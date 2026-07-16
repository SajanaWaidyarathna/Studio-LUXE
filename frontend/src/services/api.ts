import axios from "axios";
import { getToken } from "@/lib/auth";

const api = axios.create({
  baseURL: "http://localhost:5000"
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? getToken() : null;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;