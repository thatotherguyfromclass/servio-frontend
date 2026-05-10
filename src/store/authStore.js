import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,

  isAuthenticated: false,

  isLoading: true,

  register: async (formData) => {
    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      set({
        user: response.data,
        isAuthenticated: true,
      });

      toast.success("Account created successfully");

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      toast.error(message);

      throw error;
    }
  },

  login: async (formData) => {
    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      set({
        user: response.data,
        isAuthenticated: true,
      });

      toast.success("Logged in successfully");

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed";

      toast.error(message);

      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post(
        "/auth/logout"
      );

      set({
        user: null,
        isAuthenticated: false,
      });

      toast.success(
        response.data.message ||
        "Logged out successfully"
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Logout failed";

      toast.error(message);
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get(
        "/auth/me"
      );

      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
      });
      const message =
        error.response?.data?.message ||
        "Login failed";

      toast.error(message);
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;