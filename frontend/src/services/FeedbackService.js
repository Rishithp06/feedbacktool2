// src/services/FeedbackService.js
import axios from "axios";
const API_BASE = process.env.REACT_APP_FEEDBACK_SERVICE_URL || "http://localhost:5003/feedback";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

const FeedbackService = {
    // Submit feedback
    giveFeedback: async (data) => {
        data.message = data.message.trim(); // ✨ extra safety on frontend
        const response = await fetch(`${API_BASE}/give`, {
            method: "POST",
            ...getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return response.json();
    },
    

    // Get received feedback
    getReceivedFeedback: async () => {
        const response = await fetch(`${API_BASE}/received`, getAuthHeaders());
        return response.json();
    },

    // Mark feedback as read
    markAsRead: async (feedbackId) => {
        const response = await fetch(`${API_BASE}/mark-read/${feedbackId}`, {
            method: "PUT",
            ...getAuthHeaders(),
        });
        return response.json();
    },

    // Admin only: Schedule feedback (one-time)
    scheduleFeedback: async (data) => {
        const response = await fetch(`${API_BASE}/schedule`, {
            method: "POST",
            ...getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Admin only: View all scheduled feedback
    getScheduledFeedback: async () => {
        const response = await fetch(`${API_BASE}/scheduled`, getAuthHeaders());
        return response.json();
    },

    // Admin only: Edit a schedule
    editSchedule: async (id, updatedData) => {
        const response = await fetch(`${API_BASE}/schedule/${id}`, {
            method: "PUT",
            ...getAuthHeaders(),
            body: JSON.stringify(updatedData),
        });
        return response.json();
    },

    // Admin only: Delete a schedule
    deleteSchedule: async (id) => {
        const response = await fetch(`${API_BASE}/schedule/${id}`, {
            method: "DELETE",
            ...getAuthHeaders(),
        });
        return response.json();
    },

    // Super Admin only: Get all feedback
    getAllFeedback: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found. Please log in.");
        }
        const res = await axios.get(`${API_BASE}/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.feedback;
    },
    
};

export default FeedbackService;
