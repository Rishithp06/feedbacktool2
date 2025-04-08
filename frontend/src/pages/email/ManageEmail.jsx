import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header"; // Import the Header component
import "../../styles/manageEmail.css"; // Import the CSS file

const ManageEmail = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header /> {/* Add the Header component */}
            <div className="email-management-container">
                <h2>Email Group Management</h2>

                <div className="card-group">
                    <div className="card" onClick={() => navigate("/email-groups")}>
                        <div className="card-icon">📋</div>
                        <div className="card-title">View All Email Groups</div>
                    </div>

                    <div className="card" onClick={() => navigate("/email-groups/create")}>
                        <div className="card-icon">➕</div>
                        <div className="card-title">Create New Email Group</div>
                    </div>

                    <div className="card" onClick={() => navigate("/email-groups/manage/:groupName")}>
                        <div className="card-icon">👥</div>
                        <div className="card-title">Manage Members</div>
                    </div>

                    <div className="card" onClick={() => navigate("/")}>
                        <div className="card-icon">🏠</div>
                        <div className="card-title">Back to Dashboard</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageEmail;