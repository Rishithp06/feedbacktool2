// src/pages/UserEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import Header from "../../components/common/Header";
import "../../styles/useredit.css";

const UserEditPage = () => {
    const { id } = useParams(); // Optional: edit own profile if undefined
    const [form, setForm] = useState({ name: "", email: "", role: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // For role-based control

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const profile = await UserService.getProfile();
                setCurrentUser(profile);

                let userToEdit = profile;
                if (id && (profile.role === "admin" || profile.role === "super_admin")) {
                    const all = await UserService.getAllUsers();
                    userToEdit = all.find((u) => u.id === id);
                }

                if (!userToEdit) return setError("User not found");

                setForm({
                    name: userToEdit.name,
                    email: userToEdit.email,
                    role: userToEdit.role,
                });
                setLoading(false);
            } catch (err) {
                setError("Failed to load user");
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await UserService.updateUser(id, form);
        alert(res.message || "User updated");
        navigate("/profile");
    };

    if (loading) return <p>Loading user info...</p>;
    if (error) return <p style={{ color: "red", padding: "1rem" }}>{error}</p>;

    const isEditingOtherUser = id && currentUser?.role !== "user";

    return (
        <>
            <Header />
            <div className="user-edit-main">
                <div className="user-edit-card">
                    <h2>{isEditingOtherUser ? "Edit User" : "Edit My Profile"}</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Name:</label>
                        <input name="name" value={form.name} onChange={handleChange} required />

                        <label>Email:</label>
                        <input name="email" value={form.email} onChange={handleChange} required />

                        {isEditingOtherUser && (
                            <>
                                <label>Role:</label>
                                <select name="role" value={form.role} onChange={handleChange}>
                                    <option value="regular_user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </>
                        )}

                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserEditPage;
