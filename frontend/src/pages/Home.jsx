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
    <div className="home">
      <h1>Welcome to My App!</h1>
      {role === 'admin' || role === 'super_admin' ? (
        <>
          <p>You are logged in as an <strong>Admin</strong>.</p>
          <p>Access administrative features below:</p>
          <div className="admin-dashboard">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link to="/email-management">Manage Email Groups</Link>
              </li>
              <li>
                <Link to="/team-management">Manage Teams</Link>
              </li>
              <li>
                <Link to="/usermanagement">Manage Users</Link>
              </li>
              <li>
                <Link to="/admin/feedback">Manage Feedback</Link>
              </li>
            </ul>
          </div>
        </>
      ) : role ? (
        <>
          <p>You are logged in as a <strong>Regular User</strong>.</p>
          <p>Enjoy exploring the app!</p>
          <div className="user-dashboard">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link to="/feedback">Give/View Feedback</Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <p>Please log in to access personalized features.</p>
      )}
    </div>
  );
};

export default Home;
