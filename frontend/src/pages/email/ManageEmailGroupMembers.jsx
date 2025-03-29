// src/pages/email/ManageEmailGroupMembers.jsx
import React, { useState, useEffect } from "react";
import EmailGroupService from "../../services/EmailGroupService";
import UserService from "../../services/UserService";

const ManageEmailGroupMembers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [members, setMembers] = useState([]);
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const users = await UserService.getAllUsers();
            setAllUsers(users);
        } catch {
            setError("Failed to load users.");
        }
    };

    const fetchGroups = async () => {
        try {
            const groups = await EmailGroupService.getAllGroups();
            setAllGroups(groups);
        } catch {
            setError("Failed to load groups.");
        }
    };

    const fetchGroupMembers = async (groupName) => {
        try {
            const res = await EmailGroupService.getGroupMembers(groupName);
            setMembers(Array.isArray(res) ? res : []);
        } catch {
            setError("Failed to fetch group members.");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) fetchGroupMembers(selectedGroup);
    }, [selectedGroup]);

    const handleAdd = async () => {
        setMessage(null);
        setError(null);

        try {
            const res = await EmailGroupService.addUserToGroup(selectedGroup, userId);
            if (res.message?.includes("success")) {
                setMessage(res.message);
                setUserId("");
                fetchGroupMembers(selectedGroup);
            } else {
                setError(res.message || "Failed to add user.");
            }
        } catch {
            setError("Error adding user to group.");
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Remove this user from the group?")) return;

        try {
            const res = await EmailGroupService.removeUserFromGroup(selectedGroup, id);
            if (res.message?.includes("success")) {
                setMessage(res.message);
                fetchGroupMembers(selectedGroup);
            } else {
                setError(res.message || "Failed to remove user.");
            }
        } catch {
            setError("Error removing user from group.");
        }
    };

    return (
        <div className="container">
            <h2>Manage Email Group Members</h2>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "1rem" }}>
                <label>Select Email Group:</label>
                <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="">-- Select Group --</option>
                    {allGroups.map((group) => (
                        <option key={group.id} value={group.name}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedGroup && (
                <>
                    <div>
                        <label>Select User to Add:</label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <option value="">-- Select User --</option>
                            {allUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        <button onClick={handleAdd} disabled={!userId} style={{ marginLeft: "1rem" }}>
                            ➕ Add User
                        </button>
                    </div>

                    <div style={{ marginTop: "2rem" }}>
                        <h3>Current Members:</h3>
                        {members.length === 0 ? (
                            <p>No members in this group.</p>
                        ) : (
                            <ul>
                                {members.map((user) => (
                                    <li key={user.id}>
                                        {user.name} ({user.email})
                                        <button
                                            onClick={() => handleRemove(user.id)}
                                            style={{ marginLeft: "1rem" }}
                                        >
                                            ❌ Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageEmailGroupMembers;
