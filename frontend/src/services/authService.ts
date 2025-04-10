import axios from "axios";

// API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Interface for login response
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    roles: string[];
  };
}

// Interface for login request
interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Service for authentication operations
 */
const authService = {
  /**
   * Login user and store JWT token
   */
  login: async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        credentials
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  /**
   * Logout user and remove JWT token
   */
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem("token") !== null;
  },

  /**
   * Get authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  /**
   * Setup axios interceptor to add authorization header to all requests
   */
  setupAxiosInterceptors: (): void => {
    axios.interceptors.request.use(
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
  },
};

export default authService;
