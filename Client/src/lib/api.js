import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  verifyEmail: (data) => api.post("/auth/verify-email", data),
  resendVerificationEmail: (data) => api.post("/auth/resend-verification", data),
  getProfile: () => api.get("/users/profile"),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.patch("/users/profile", data),
  updatePassword: (data) => api.patch("/users/password", data),
  getDashboard: () => api.get("/users/dashboard"),
};

// Pet API
export const petAPI = {
  getAllPets: (params) => api.get("/pets", { params }),
  getUserPets: () => api.get("/pets/my-pets"),
  getPet: (id) => api.get(`/pets/${id}`),
  createPet: (data) => api.post("/pets", data),
  updatePet: (id, data) => api.patch(`/pets/${id}`, data),
  deletePet: (id) => api.delete(`/pets/${id}`),
  approvePet: (id) => api.patch(`/pets/${id}/approve`),
};

// Booking API
export const bookingAPI = {
  getAllBookings: (params) => api.get("/bookings", { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  createBooking: (data) => api.post("/bookings", data),
  updateBooking: (id, data) => api.patch(`/bookings/${id}`, data),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
  confirmBooking: (id) => api.patch(`/bookings/${id}/confirm`),
};

// Health API
export const healthAPI = {
  getPetHealthLogs: (petId) => api.get(`/health/pet/${petId}`),
  getHealthLog: (id) => api.get(`/health/${id}`),
  createHealthLog: (data) => api.post("/health", data),
  updateHealthLog: (id, data) => api.patch(`/health/${id}`, data),
  deleteHealthLog: (id) => api.delete(`/health/${id}`),
};

// Training API
export const trainingAPI = {
  getAllResources: (params) => api.get("/training", { params }),
  getResource: (id) => api.get(`/training/${id}`),
  getCategories: () => api.get("/training/categories"),
  createResource: (data) => api.post("/training", data),
  updateResource: (id, data) => api.patch(`/training/${id}`, data),
  deleteResource: (id) => api.delete(`/training/${id}`),
};

// Notification API
export const notificationAPI = {
  getUserNotifications: (params) => api.get("/notifications", { params }),
  getNotification: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/mark-all-read"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  createNotification: (data) => api.post("/notifications", data),
};

// Donation API
export const donationAPI = {
  getAllDonations: (params) => api.get("/donations", { params }),
  getDonation: (id) => api.get(`/donations/${id}`),
  createDonation: (data) => api.post("/donations", data),
  updateDonationStatus: (id, data) =>
    api.patch(`/donations/${id}/status`, data),
  getDonationStats: () => api.get("/donations/stats"),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),
  getAllUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, data) => api.patch(`/admin/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingApprovals: () => api.get("/admin/pets/pending"),
  bulkApprovePets: (data) => api.patch("/admin/pets/bulk-approve", data),
  // Admin booking management
  getAllBookings: (params) => api.get("/admin/bookings", { params }),
  confirmBooking: (id) => api.patch(`/admin/bookings/${id}/confirm`),
  // Admin donation management
  getAllDonations: (params) => api.get("/admin/donations", { params }),
  getDonationStats: () => api.get("/admin/donations/stats"),
  updateDonationStatus: (id, data) => api.patch(`/admin/donations/${id}/status`, data),
};

export default api;
