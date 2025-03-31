// src/components/common/RoleBasedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" />;

    try {
        const user = jwtDecode(token);
        if (allowedRoles.includes(user.role)) {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    } catch (error) {
        return <Navigate to="/login" />;
    }
};

export default RoleBasedRoute;
