// services/UserService.js
const API_BASE = process.env.REACT_APP_USER_SERVICE_URL || "http://localhost:5002/user";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
};

const UserService = {
    // Get current user profile
    getProfile: async () => {
        const response = await fetch(`${API_BASE}/profile`, getAuthHeaders());
        return response.json();
    },

    // Get all users (admin/super admin only)
    getAllUsers: async () => {
        const response = await fetch(`${API_BASE}/all`, getAuthHeaders());
        return response.json();
    },

    // Update user (self or others based on role) — now includes role update
    updateUser: async (id, data) => {
        const url = id ? `${API_BASE}/update/${id}` : `${API_BASE}/update`;
        const response = await fetch(url, {
            method: "PUT",
            ...getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Delete a user (admin/super admin)
    deleteUser: async (id) => {
        const response = await fetch(`${API_BASE}/delete/${id}`, {
            method: "DELETE",
            ...getAuthHeaders(),
        });
        return response.json();
    },
};

export default UserService;
