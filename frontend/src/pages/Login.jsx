import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import Header from '../components/common/Header';
import '../styles/login.css';

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
      localStorage.setItem('token', response.token);
      navigate('/'); // Default redirect after local login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
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

          <div className="azure-login">
            <p>or</p>
            <a href="http://localhost:5001/auth/azure" className="azure-login-button">
              Login with Nokia Azure SSO
            </a>
          </div>

          <div className="login-links">
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
