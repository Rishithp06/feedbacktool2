// src/pages/email/CreateEmailGroupPage.jsx
import React, { useState } from "react";
import EmailGroupService from "../../services/EmailGroupService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header"; // ✅ Include the header
import "../../styles/createemailgroup.css"; // ✅ Scoped CSS

const CreateEmailGroupPage = () => {
    const [groupName, setGroupName] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const res = await EmailGroupService.createGroup(groupName);
            if (res.message?.includes("success")) {
                setMessage(res.message);
                setGroupName("");
            } else {
                setError(res.message || "Failed to create email group.");
            }
        } catch {
            setError("Error creating email group.");
        }
    };

    return (
        <>
            <Header />
            <div className="create-group-main">
                <div className="create-group-card">
                    <h2>Create Email Group</h2>

                    {message && <p className="success-msg">{message}</p>}
                    {error && <p className="error-msg">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <label>Group Name:</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                        <button type="submit">Create Group</button>
                    </form>

                    <button className="back-btn" onClick={() => navigate("/email-groups")}>
                        ← Back to Group List
                    </button>
                </div>
            </div>
        </>
    );
};

export default CreateEmailGroupPage;
