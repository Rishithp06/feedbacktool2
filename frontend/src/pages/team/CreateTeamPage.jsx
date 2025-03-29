// src/pages/team/CreateTeamPage.jsx
import React, { useEffect, useState } from "react";
import TeamService from "../../services/TeamService";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const CreateTeamPage = () => {
    const [teamName, setTeamName] = useState("");
    const [userEmails, setUserEmails] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await UserService.getAllUsers();
                setAllUsers(users);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    const handleUserAdd = (email) => {
        const emailsArray = userEmails
            .split(",")
            .map(e => e.trim())
            .filter(e => e !== "");

        if (!emailsArray.includes(email)) {
            emailsArray.push(email);
            setUserEmails(emailsArray.join(", "));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const res = await TeamService.createTeam(teamName, userEmails);
        if (res.message?.includes("success")) {
            setMessage(res.message);
            setTeamName("");
            setUserEmails("");
        } else {
            setError(res.message || "Failed to create team.");
        }
    };

    return (
        <div className="container">
            <h2>Create New Team</h2>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Team Name:</label>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                />

                <label>User Emails (comma-separated):</label>
                <textarea
                    value={userEmails}
                    onChange={(e) => setUserEmails(e.target.value)}
                    placeholder="example1@email.com, example2@email.com"
                    required
                />

                <label>Quick Add User from Dropdown:</label>
                <select
                    onChange={(e) => handleUserAdd(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Select user to add</option>
                    {allUsers.map((user) => (
                        <option key={user.id} value={user.email}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>

                <button type="submit" style={{ marginTop: "1rem" }}>Create Team</button>
            </form>

            <button onClick={() => navigate("/teams")}>← Back to Team List</button>
        </div>
    );
};

export default CreateTeamPage;
