import axios from "axios";
import authService from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized response
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // If we already tried to refresh, don't try again
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // Signal that we're retrying the request
      originalRequest._retry = true;

      // Force logout and redirect to login page
      authService.logout();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
