// src/pages/team/TeamManagement.jsx
import React from "react";
import { useNavigate } from "react-router-dom";


const TeamManagement = () => {
    const navigate = useNavigate();

    return (
        <div className="team-management-container">
            <h2>Team Management</h2>

            <div className="button-group">
                <button onClick={() => navigate("/teams")}>📋 View All Teams</button>
                <button onClick={() => navigate("/team/create")}>➕ Create New Team</button>
                
                <button onClick={() => navigate("/")}>🏠 Back to Dashboard</button>
            </div>

           
        </div>
    );
};

export default TeamManagement;
