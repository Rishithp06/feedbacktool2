// src/pages/user/UserManagementPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import "../../styles/usermanagement.css"; // Scoped styles

const UserManagementPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="user-management-main">
                <div className="user-management-card">
                    <h2>User Management</h2>

                    <div className="button-group">
                        <button onClick={() => navigate("/profile")}>👤 View My Profile</button>
                        <button onClick={() => navigate("/users")}>📋 View All Users</button>
                        <button onClick={() => navigate("/")}>🏠 Back to Dashboard</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserManagementPage;
