// src/services/TeamService.js

const API_BASE = process.env.REACT_APP_USER_SERVICE_URL || "http://localhost:5002/team";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

const TeamService = {
    // Create a new team with users
    createTeam: async (teamName, userEmails) => {
        const response = await fetch(`${API_BASE}/create`, {
            method: "POST",
            ...getAuthHeaders(),
            body: JSON.stringify({ teamName, userEmails }),
        });
        return response.json();
    },

    // Get all teams
    getAllTeams: async () => {
        const response = await fetch(`${API_BASE}/all`, getAuthHeaders());
        return response.json();
    },

    // Get members of a specific team
    getTeamMembers: async (teamId) => {
        const response = await fetch(`${API_BASE}/members/${teamId}`, getAuthHeaders());
        return response.json();
    },

    // Add user to a team
    addUserToTeam: async (teamId, userEmail) => {
        const response = await fetch(`${API_BASE}/add-user`, {
            method: "POST",
            ...getAuthHeaders(),
            body: JSON.stringify({ teamId, userEmail }),
        });
        return response.json();
    },

    // Remove user from a team
    removeUserFromTeam: async (teamId, userEmail) => {
        const response = await fetch(`${API_BASE}/remove-user`, {
            method: "DELETE",
            ...getAuthHeaders(),
            body: JSON.stringify({ teamId, userEmail }),
        });
        return response.json();
    },

    // Delete a team
    deleteTeam: async (teamId) => {
        const response = await fetch(`${API_BASE}/delete/${teamId}`, {
            method: "DELETE",
            ...getAuthHeaders(),
        });
        return response.json();
    },
};

export default TeamService;
