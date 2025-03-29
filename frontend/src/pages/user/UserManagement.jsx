// src/pages/user/UserManagementPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/main.css"; // optional if you're using a global stylesheet

const UserManagementPage = () => {
    const navigate = useNavigate();

    return (
        <div className="user-management-container">
            <h2>User Management</h2>

            <div className="button-group">
                <button onClick={() => navigate("/profile")}>👤 View My Profile</button>
                <button onClick={() => navigate("/users")}>📋 View All Users</button>
                <button onClick={() => navigate("/")}>🏠 Back to Dashboard</button>
            </div>
        </div>
    );
};

export default UserManagementPage;
