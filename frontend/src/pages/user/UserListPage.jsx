// pages/UserListPage.jsx
import React, { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        UserService.getAllUsers()
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error fetching users:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const res = await UserService.deleteUser(id);
            alert(res.message);
            setUsers(users.filter((u) => u.id !== id));
        }
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="container">
            <h2>All Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.email}) - {user.role}
                        <button onClick={() => handleEdit(user.id)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserListPage;
