// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error('Token decoding failed:', error);
    }
  }

  return (
    <div className="home-container">
      <div className="welcome-banner">
        <h1>Welcome to My App!</h1>
      </div>
      {role === 'admin' || role === 'super_admin' ? (
        <div className="dashboard admin-dashboard">
          <p className="role-text">You are logged in as an <strong>Admin</strong>.</p>
          <p>Access administrative features below:</p>
          <ul className="dashboard-list">
            <li>
              <Link to="/email-management" className="dashboard-link">Manage Email Groups</Link>
            </li>
            <li>
              <Link to="/team-management" className="dashboard-link">Manage Teams</Link>
            </li>
            <li>
              <Link to="/usermanagement" className="dashboard-link">Manage Users</Link>
            </li>
            <li>
              <Link to="/admin/feedback" className="dashboard-link">Manage Feedback</Link>
            </li>
          </ul>
        </div>
      ) : role ? (
        <div className="dashboard user-dashboard">
          <p className="role-text">You are logged in as a <strong>Regular User</strong>.</p>
          <p>Enjoy exploring the app!</p>
          <ul className="dashboard-list">
            <li>
              <Link to="/feedback" className="dashboard-link">Give/View Feedback</Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please log in to access personalized features.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
