// src/pages/email/ManageEmail.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/main.css"; // adjust if needed

const ManageEmail = () => {
    const navigate = useNavigate();

    return (
        <div className="email-management-container">
            <h2>Email Group Management</h2>

            <div className="button-group">
                <button onClick={() => navigate("/email-groups")}>📋 View All Email Groups</button>
                <button onClick={() => navigate("/email-groups/create")}>➕ Create New Email Group</button>
                <button onClick={() => navigate("/email-groups/manage/:groupName")}>
                    👥 Manage Members
                </button>
                <button onClick={() => navigate("/")}>🏠 Back to Dashboard</button>
            </div>
        </div>
    );
};

export default ManageEmail;
