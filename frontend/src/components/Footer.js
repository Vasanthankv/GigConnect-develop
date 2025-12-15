import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-white">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <span className="footer-logo-letter">G</span>
            </div>
            <span className="footer-logo-text">GigConnect</span>
          </div>
          <p className="footer-text">
            &copy; 2024 GigConnect. The modern platform for professional talent.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;