import React from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import for jwt-decode
import '../styles/home.css'; // Import the CSS
import Header from '../components/common/Header'; // Import the Header component

const Home = () => {
  const token = localStorage.getItem('token');
  let role = null;

  // Decode the token to get the user's role
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error('Token decoding failed:', error);
    }
  }

  return (
    <div className="home-page">
    <Header />
    <div className="home-container">
      
      <div className="welcome-banner">
        <h1>Welcome to My App!</h1>
      </div>
      {role === 'admin' || role === 'super_admin' ? (
        <div className="dashboard admin-dashboard">
          <Link to="/email-groups" className="dashboard-card">
            <h3>Manage Email Groups</h3>
            <p>Organize and manage email groups efficiently.</p>
          </Link>
          <Link to="/team-management" className="dashboard-card">
            <h3>Manage Teams</h3>
            <p>Oversee and manage team structures.</p>
          </Link>
          <Link to="/usermanagement" className="dashboard-card">
            <h3>Manage Users</h3>
            <p>Control user access and permissions.</p>
          </Link>
          <Link to="/admin/feedback" className="dashboard-card">
            <h3>Manage Feedback</h3>
            <p>Review and manage feedback submissions.</p>
          </Link>
        </div>
      ) : role ? (
        <div className="dashboard user-dashboard">
          <Link to="/feedback-give" className="dashboard-card">
            <h3>Give Feedback</h3>
            <p>Submit your feedback to help improve the system.</p>
          </Link>
          <Link to="/feedback-see" className="dashboard-card">
            <h3>View Received Feedback</h3>
            <p>Check feedback you have received.</p>
          </Link>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please log in to access personalized features.</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Home;