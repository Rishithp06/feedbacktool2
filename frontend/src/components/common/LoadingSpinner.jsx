// src/components/common/LoadingSpinner.jsx
import React from 'react';
import '../../styles/main.css'; // Ensure spinner styles are defined here

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
