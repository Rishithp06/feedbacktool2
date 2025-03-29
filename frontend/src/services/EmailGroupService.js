// src/services/EmailGroupService.js

const API_BASE = process.env.REACT_APP_USER_SERVICE_URL || "http://localhost:5002/email-group";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

const EmailGroupService = {
    // Create a new email group
    createGroup: async (groupName) => {
        const response = await fetch(`${API_BASE}/create`, {
            method: "POST",
            ...getAuthHeaders(),
            body: JSON.stringify({ groupName }),
        });
        return response.json();
    },

    // Get all email groups
    getAllGroups: async () => {
        const response = await fetch(`${API_BASE}/all`, getAuthHeaders());
        return response.json();
    },

    // Add a user to a group by group name and user ID
    addUserToGroup: async (groupName, userId) => {
        const response = await fetch(`${API_BASE}/add-user`, {
            method: "POST",
            ...getAuthHeaders(),
            body: JSON.stringify({ groupName, userId }),
        });
        return response.json();
    },

    // Remove a user from a group
    removeUserFromGroup: async (groupName, userId) => {
        const response = await fetch(`${API_BASE}/remove-user`, {
            method: "DELETE",
            ...getAuthHeaders(),
            body: JSON.stringify({ groupName, userId }),
        });
        return response.json();
    },
    // Get members of a group
getGroupMembers: async (groupName) => {
    const response = await fetch(`${API_BASE}/members/${groupName}`, getAuthHeaders());
    return response.json();
},
deleteGroup: async (groupId) => {
    const response = await fetch(`${API_BASE}/delete/${groupId}`, {
        method: "DELETE",
        ...getAuthHeaders(),
    });
    return response.json();
}

};


export default EmailGroupService;
