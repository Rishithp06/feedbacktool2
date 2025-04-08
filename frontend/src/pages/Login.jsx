import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import Header from '../components/common/Header'; // Import the Header component
import '../styles/login.css'; // Import the CSS for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      console.log('Login successful:', response);
      localStorage.setItem('token', response.token);
      navigate('/'); // Redirect to home or protected page
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header /> {/* Add the Header component */}
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="login-links">
            
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;