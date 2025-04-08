import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header'; // Import the Header component
import { registerUser } from '../services/api'; // Import the API function
import '../styles/register.css'; // Import the CSS for styling

const RegisterUser = () => {
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
      // Call the API to register the user
      const response = await registerUser({ name, email, password });
      console.log('User registration successful:', response);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error(err.message);
      setError(err.message); // Display the error message from the API
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header /> {/* Add the Header component */}
      <div className="register-page">
        <div className="register-container">
          <h1 className="register-title">Register as a User</h1>
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

export default RegisterUser;