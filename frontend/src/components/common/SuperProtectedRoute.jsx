// components/common/AdminProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const SuperProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        if (role !== "super_admin") {
            return <Navigate to="/" replace />;
        }

        return children;
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" replace />;
    }
};

export default SuperProtectedRoute;
