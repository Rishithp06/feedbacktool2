import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import '../../styles/header.css'; // Ensure you have the CSS file for styling

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const token = localStorage.getItem('token');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">FeedbackTool</Link>
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {/* Conditionally render the Register dropdown */}
          {location.pathname === '/login' && (
            <li className="nav-item dropdown">
              <span className="nav-link" onClick={toggleDropdown}>
                Register ▼
              </span>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <Link to="/register/user" className="dropdown-link">User</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/register/admin" className="dropdown-link">Admin</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/register/super-admin" className="dropdown-link">Super Admin</Link>
                  </li>
                </ul>
              )}
            </li>
          )}
          {/* Conditionally render the Login button */}
          {location.pathname.startsWith('/register') && (
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          )}
          {/* Conditionally render Logout if token exists */}
          {location.pathname !== '/login' && location.pathname !== '/register' && token && (
            <li className="nav-item">
              <Link
                to="/login"
                className="nav-link"
                onClick={handleLogout} // Call logout logic on click
              >
                Logout
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;