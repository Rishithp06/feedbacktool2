// src/pages/team/TeamListPage.jsx
import React, { useEffect, useState } from "react";
import TeamService from "../../services/TeamService";
import EmailGroupService from "../../services/EmailGroupService";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const TeamListPage = () => {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [selectedUserEmail, setSelectedUserEmail] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [emailGroups, setEmailGroups] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        TeamService.getAllTeams()
            .then((data) => {
                setTeams(data);
                setFilteredTeams(data);
            })
            .catch(() => setError("Failed to fetch teams"));

        fetchEmailGroups();
        fetchAllUsers();
    }, []);

    const fetchEmailGroups = async () => {
        try {
            const groups = await EmailGroupService.getAllGroups();
            setEmailGroups(groups);
        } catch {
            console.error("Failed to load email groups.");
        }
    };

    const fetchAllUsers = async () => {
        try {
            const users = await UserService.getAllUsers();
            setAllUsers(users);
        } catch {
            console.error("Failed to load users");
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = teams.filter((team) =>
            team.name.toLowerCase().includes(query)
        );
        setFilteredTeams(filtered);
    };

    const handleDeleteTeam = async (teamId) => {
        if (window.confirm("Are you sure you want to delete this team?")) {
            const res = await TeamService.deleteTeam(teamId);
            if (res.message?.includes("success")) {
                const updatedTeams = teams.filter((team) => team.id !== teamId);
                setTeams(updatedTeams);
                setFilteredTeams(updatedTeams);
                setSelectedTeamId(null);
                setMembers([]);
                setMessage(res.message);
            } else {
                setError(res.message || "Error deleting team");
            }
        }
    };

    const handleViewMembers = async (teamId) => {
        if (selectedTeamId === teamId) {
            setSelectedTeamId(null);
            setMembers([]);
            return;
        }

        setSelectedTeamId(teamId);
        const res = await TeamService.getTeamMembers(teamId);
        if (Array.isArray(res)) setMembers(res);
        else if (Array.isArray(res?.rows)) setMembers(res.rows);
        else setMembers([]);
    };

    const handleRemoveMember = async (email) => {
        if (!selectedTeamId) return;
        if (!window.confirm(`Remove ${email} from this team?`)) return;

        const res = await TeamService.removeUserFromTeam(selectedTeamId, email);
        if (res.message?.includes("success")) {
            setMessage(res.message);
            handleViewMembers(selectedTeamId);
        } else {
            setError(res.message || "Failed to remove user");
        }
    };

    const handleAddUser = async (teamId) => {
        if (!selectedUserEmail) return;

        const res = await TeamService.addUserToTeam(teamId, selectedUserEmail);
        if (res.message?.includes("success")) {
            setMessage(res.message);
            setSelectedUserEmail("");
            handleViewMembers(teamId);
        } else {
            setError(res.message || "Failed to add user.");
        }
    };

    const handleAddGroup = async (teamId) => {
        if (!selectedGroup) return;

        try {
            const members = await EmailGroupService.getGroupMembers(selectedGroup);
            const addPromises = members.map((user) =>
                TeamService.addUserToTeam(teamId, user.email)
            );

            await Promise.allSettled(addPromises);
            setMessage(`Added ${members.length} users from "${selectedGroup}"`);
            setSelectedGroup("");
            handleViewMembers(teamId);
        } catch {
            setError("Failed to add users from group.");
        }
    };

    return (
        <div className="container">
            <h2>All Teams</h2>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Search teams by name..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ padding: "0.5rem", width: "60%" }}
                />
                <button onClick={() => navigate("/team/create")} style={{ marginLeft: "1rem" }}>
                    + Create New Team
                </button>
            </div>

            {filteredTeams.length === 0 ? (
                <p>No teams found.</p>
            ) : (
                <ul>
                    {filteredTeams.map((team) => (
                        <li key={team.id} style={{ marginBottom: "1rem" }}>
                            <strong>{team.name}</strong>

                            <div>
                                <button onClick={() => handleViewMembers(team.id)}>👥 View Members</button>
                                <button onClick={() => handleDeleteTeam(team.id)} style={{ marginLeft: "0.5rem" }}>
                                    🗑️ Delete Team
                                </button>
                            </div>

                            {selectedTeamId === team.id && (
                                <div style={{ marginTop: "0.5rem" }}>
                                    <strong>Members:</strong>
                                    {members.length === 0 ? (
                                        <p>No members in this team.</p>
                                    ) : (
                                        <ul>
                                            {members.map((member) => (
                                                <li key={member.id}>
                                                    {member.name} ({member.email})
                                                    <button
                                                        style={{ marginLeft: "1rem" }}
                                                        onClick={() => handleRemoveMember(member.email)}
                                                    >
                                                        ❌ Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Add user from dropdown */}
                                    <div style={{ marginTop: "1rem" }}>
                                        <label>Add User from List:</label>
                                        <select
                                            value={selectedUserEmail}
                                            onChange={(e) => setSelectedUserEmail(e.target.value)}
                                        >
                                            <option value="">-- Select User --</option>
                                            {allUsers.map((user) => (
                                                <option key={user.id} value={user.email}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleAddUser(team.id)}
                                            disabled={!selectedUserEmail}
                                            style={{ marginLeft: "0.5rem" }}
                                        >
                                            ➕ Add User
                                        </button>
                                    </div>

                                    {/* Add group members */}
                                    <div style={{ marginTop: "1rem" }}>
                                        <label>Add All from Email Group:</label>
                                        <select
                                            value={selectedGroup}
                                            onChange={(e) => setSelectedGroup(e.target.value)}
                                        >
                                            <option value="">-- Select Email Group --</option>
                                            {emailGroups.map((group) => (
                                                <option key={group.id} value={group.name}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleAddGroup(team.id)}
                                            disabled={!selectedGroup}
                                            style={{ marginLeft: "0.5rem" }}
                                        >
                                            ➕ Add All from Group
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeamListPage;
