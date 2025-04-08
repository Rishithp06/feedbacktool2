import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAdmin } from '../services/api'; // Import the API function
import Header from '../components/common/Header'; // Import the Header component
import '../styles/register.css'; // Import the CSS for styling

const RegisterAdmin = () => {
  const [name, setName] = useState('');
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
      const response = await registerAdmin({ name, email, password });
      console.log('Admin registered successfully:', response);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'User Already exists');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header /> {/* Include Header component */}
      <div className="register-page">
        <div className="register-container">
          <h1 className="register-title">Register as an Admin</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterAdmin;