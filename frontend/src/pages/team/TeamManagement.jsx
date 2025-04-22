// src/pages/team/TeamManagement.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header"; // ✅ Import Header
import "../../styles/teammanagement.css"; // ✅ Scoped styles

const TeamManagement = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="team-management-main">
                <div className="team-management-card">
                    <h2>Team Management</h2>

                    <div className="button-group">
                        <button onClick={() => navigate("/teams")}>📋 View All Teams</button>
                        <button onClick={() => navigate("/team/create")}>➕ Create New Team</button>
                        <button onClick={() => navigate("/")}>🏠 Back to Dashboard</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamManagement;
