// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Register a regular user
export const registerUser = async (userData) => {
  const response = await api.post('/register/user', userData);
  return response.data;
};

// Register an admin
export const registerAdmin = async (adminData) => {
  const response = await api.post('/register/admin', adminData);
  return response.data;
};

// Register a super admin
export const registerSuperAdmin = async (superAdminData) => {
  const response = await api.post('/register/super-admin', superAdminData);
  return response.data;
};

// Login endpoint
export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

// Forgot Password endpoint
export const forgotPassword = async (emailData) => {
  const response = await api.post('/forgot-password', emailData);
  return response.data;
};

// Reset Password endpoint
export const resetPassword = async (data) => {
  const response = await api.post('/reset-password', data);
  return response.data;
};

export default api;
