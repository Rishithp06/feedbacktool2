import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("invalid");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const { role, exp } = decoded;

      if (Date.now() >= exp * 1000) {
        console.warn("Token expired");
        setStatus("expired");
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);
      setStatus("success");

      // Delay to ensure token is stored before route checks
      setTimeout(() => {
        if (role === "super_admin") navigate("/forgot-password");
        else if (role === "admin") navigate("/reset-password");
        else navigate("/");
      }, 100);
    } catch (err) {
      console.error("Token decode failed:", err);
      setStatus("invalid");
      navigate("/login");
    }
  }, [navigate]);

  if (status === "processing") return <p>Authenticating via Azure...</p>;
  return null;
};

export default AuthRedirect;
