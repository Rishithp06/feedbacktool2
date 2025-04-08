import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message); // Throw the backend error message
  } else {
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

// Register a regular user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register/user', userData);
    return response.data;
  } catch (error) {
    handleApiError(error); // Handle the error
  }
};

// Register an admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post('/register/admin', adminData);
    return response.data;
  } catch (error) {
    handleApiError(error); // Handle the error
  }
};

// Register a super admin
export const registerSuperAdmin = async (superAdminData) => {
  try {
    const response = await api.post('/register/super-admin', superAdminData);
    return response.data;
  } catch (error) {
    handleApiError(error); // Handle the error
  }
};

// Login endpoint
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    handleApiError(error); // Handle the error
  }
};

// Forgot Password endpoint
export const forgotPassword = async (emailData) => {
  try {
    const response = await api.post('/forgot-password', emailData);
    return response.data;
  } catch (error) {
    handleApiError(error); // Handle the error
  }
};

// Reset Password endpoint
export const resetPassword = async (data) => {
  try {
    const response = await api.post('/reset-password', data);
    return response.data;
  } catch (error) {
    handleApiError(error); // Handle the error
  }
};

export default api;