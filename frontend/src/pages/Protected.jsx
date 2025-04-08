// src/pages/Protected.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Protected = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Set token in axios headers
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch protected data from the backend
    api.get('/protected')
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error fetching protected data');
        // If unauthorized, remove token and redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      });
  }, [navigate]);

  return (
    <div className="protected">
      <h1>Protected Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data ? (
        <div>
          <p>{data.message}</p>
          {data.user && <pre>{JSON.stringify(data.user, null, 2)}</pre>}
        </div>
      ) : (
        !error && <p>Loading protected data...</p>
      )}
    </div>
  );
};

export default Protected;
