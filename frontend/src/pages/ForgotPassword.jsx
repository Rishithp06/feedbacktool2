// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { forgotPassword } from '../services/api';
import Header from '../components/common/Header';
import '../styles/forgotpassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="forgot-password-wrapper">
        <div className="forgot-password-card">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="error-msg">{error}</p>}
            {message && <p className="success-msg">{message}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
