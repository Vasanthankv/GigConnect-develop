import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login', 
        { email, password }
      );
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/auth/google/url');
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError('Google authentication failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Header */}
        <div className="login-header">
          <div className="logo-container hover-lift">
            <div className="logo-icon">
              <span className="logo-letter">G</span>
            </div>
            <span className="logo-text">GigConnect</span>
          </div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="card-bolt">
          {error && (
            <div className="alert-bolt-error">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button 
            onClick={handleGoogleSignIn}
            className="btn-bolt-google"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Connecting to Google...
              </div>
            ) : (
              <>
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google" 
                  width="20" 
                  height="20" 
                />
                Continue with Google
              </>
            )}
          </button>

          <div className="divider">
            <div className="divider-text">Or continue with email</div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group-bolt">
              <label className="form-label-bolt">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="form-input-bolt"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group-bolt">
              <div className="flex items-center justify-between mb-2">
                <label className="form-label-bolt">
                  Password
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                className="form-input-bolt"
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className={`btn-bolt-primary ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="signup-link">
              Don't have an account?{' '}
              <Link to="/register">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;