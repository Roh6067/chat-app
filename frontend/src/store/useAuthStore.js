import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false, 
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check', {
        withCredentials: true,
      }); 
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true }); 
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      // get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
    
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      } finally {
      set({ isUpdatingProfile: false });
    }
  },

}));

export default useAuthStore;