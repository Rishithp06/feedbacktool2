// src/pages/email/CreateEmailGroupPage.jsx
import React, { useState } from "react";
import EmailGroupService from "../../services/EmailGroupService";
import { useNavigate } from "react-router-dom";

const CreateEmailGroupPage = () => {
    const [groupName, setGroupName] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const res = await EmailGroupService.createGroup(groupName);

        if (res.message?.includes("success")) {
            setMessage(res.message);
            setGroupName("");
        } else {
            setError(res.message || "Failed to create email group.");
        }
    };

    return (
        <div className="container">
            <h2>Create Email Group</h2>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Group Name:</label>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />

                <button type="submit" style={{ marginTop: "1rem" }}>
                    Create Group
                </button>
            </form>

            <button onClick={() => navigate("/email-groups")} style={{ marginTop: "1rem" }}>
                ← Back to Group List
            </button>
        </div>
    );
};

export default CreateEmailGroupPage;
