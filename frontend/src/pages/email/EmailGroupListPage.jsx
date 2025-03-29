// src/pages/email/EmailGroupListPage.jsx
import React, { useEffect, useState } from "react";
import EmailGroupService from "../../services/EmailGroupService";
import { useNavigate } from "react-router-dom";

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
        <div className="container">
            <h2>Email Groups</h2>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={() => navigate("/email-groups/create")}>
                ➕ Create New Group
            </button>

            {groups.length === 0 ? (
                <p>No email groups found.</p>
            ) : (
                <ul style={{ marginTop: "1rem" }}>
                    {groups.map((group) => (
                        <li key={group.id} style={{ marginBottom: "1rem" }}>
                            <strong>{group.name}</strong> (ID: {group.id})
                            <div style={{ marginTop: "0.5rem" }}>
                                <button onClick={() => navigate(`/email-groups/manage/${group.name}`)}>
                                    👥 Manage Members
                                </button>
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    style={{ marginLeft: "1rem", backgroundColor: "#f44336", color: "white" }}
                                >
                                    🗑️ Delete Group
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmailGroupListPage;
