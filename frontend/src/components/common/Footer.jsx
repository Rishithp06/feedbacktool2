// src/components/common/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '1rem', textAlign: 'center' }}>
      <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
