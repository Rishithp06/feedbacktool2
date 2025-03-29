// pages/UserEditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
const UserEditPage = () => {
    const { id } = useParams(); // Optional param
    const [form, setForm] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const user = id ? await UserService.getAllUsers().then(res => res.find(u => u.id === id)) : await UserService.getProfile();
            setForm({ name: user.name, email: user.email });
            setLoading(false);
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await UserService.updateUser(id, form);
        alert(res.message || "User updated");
        navigate("/profile");
    };

    if (loading) return <p>Loading user info...</p>;

    return (
        <div className="container">
            <h2>{id ? "Edit User" : "Edit My Profile"}</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input name="name" value={form.name} onChange={handleChange} required />
                <br />
                <label>Email:</label>
                <input name="email" value={form.email} onChange={handleChange} required />
                <br />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UserEditPage;
