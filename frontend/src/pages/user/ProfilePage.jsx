// pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import UserService from "../../services/UserService";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UserService.getProfile()
            .then((data) => setUser(data))
            .catch((err) => console.error("Error fetching profile:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className="container">
            <h2>My Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </div>
    );
};

export default ProfilePage;
