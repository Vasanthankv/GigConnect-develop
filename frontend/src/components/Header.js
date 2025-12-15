import React from 'react';
import './Header.css';  
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header-gradient header-glass header-shadow sticky top-0 z-50">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <span className="logo-letter">G</span>
            </div>
            <span className="logo-text">GigConnect</span>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            {user ? (
              <div className="user-section">
                <span className="welcome-text">
                  Welcome, <span className="user-name">{user.name}</span>
                </span>
                <Link 
                  to="/dashboard" 
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;