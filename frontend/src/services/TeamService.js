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
    // ✅ Upload Excel file to auto-create teams and members
    uploadExcel: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
  
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${API_BASE}/upload-excel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      return response.json();
    },
  
  // ✅ Create a new team with a list of user emails (Admin only)
  createTeam: async (teamName, userEmails) => {
    const response = await fetch(`${API_BASE}/create`, {
      method: "POST",
      ...getAuthHeaders(),
      body: JSON.stringify({ teamName, userEmails }),
    });
    return response.json();
  },

  // ✅ Get all teams created by current admin
  getAllTeams: async () => {
    const response = await fetch(`${API_BASE}/all`, getAuthHeaders());
    return response.json();
  },

  // ✅ Get members of a team owned by current admin
  getTeamMembers: async (teamId) => {
    const response = await fetch(`${API_BASE}/members/${teamId}`, getAuthHeaders());
    return response.json();
  },

  // ✅ Add a user to a team you own
  addUserToTeam: async (teamId, userEmail) => {
    const response = await fetch(`${API_BASE}/add-user`, {
      method: "POST",
      ...getAuthHeaders(),
      body: JSON.stringify({ teamId, userEmail }),
    });
    return response.json();
  },

  // ✅ Remove a user from a team you own
  removeUserFromTeam: async (teamId, userEmail) => {
    const response = await fetch(`${API_BASE}/remove-user`, {
      method: "DELETE",
      ...getAuthHeaders(),
      body: JSON.stringify({ teamId, userEmail }),
    });
    return response.json();
  },

  // ✅ Delete a team you created
  deleteTeam: async (teamId) => {
    const response = await fetch(`${API_BASE}/delete/${teamId}`, {
      method: "DELETE",
      ...getAuthHeaders(),
    });
    return response.json();
  },
};

export default TeamService;
