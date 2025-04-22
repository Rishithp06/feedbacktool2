import React, { useEffect, useState } from "react";
import EmailGroupService from "../../services/EmailGroupService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header"; // Import the Header component
import "../../styles/emailGroupList.css"; // Import the CSS file

const EmailGroupListPage = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await EmailGroupService.getAllGroups();
            setGroups(res);
        } catch (err) {
            setError("Failed to fetch email groups.");
        }
    };

    const handleDelete = async (groupId) => {
        const confirm = window.confirm("Are you sure you want to delete this email group?");
        if (!confirm) return;

        try {
            const res = await EmailGroupService.deleteGroup(groupId);
            if (res.message?.includes("success")) {
                setMessage(res.message);
                setGroups(groups.filter(group => group.id !== groupId));
            } else {
                setError(res.message || "Failed to delete group.");
            }
        } catch {
            setError("Error deleting group.");
        }
    };

    return (
        <>
            <Header /> {/* Add the Header component */}
            <div className="email-group-list-container">
                <h2>Email Groups</h2>

                {/* Success and Error Messages */}
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {/* Create New Group Button */}
                <button className="create-group-button" onClick={() => navigate("/email-groups/create")}>
                    ➕ Create New Group
                </button>

                {/* Email Groups List */}
                {groups.length === 0 ? (
                    <p className="no-groups-message">No email groups found.</p>
                ) : (
                    <ul className="email-group-list">
                        {groups.map((group) => (
                            <li key={group.id} className="email-group-item">
                                <div className="group-info">
                                    <strong>{group.name}</strong> <span></span>
                                </div>
                                <div className="group-actions">
                                    <button
                                        className="manage-button"
                                        onClick={() => navigate(`/email-groups/manage/${group.name}`)}
                                    >
                                        👥 Manage Members
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(group.id)}
                                    >
                                        🗑️ Delete Group
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default EmailGroupListPage;