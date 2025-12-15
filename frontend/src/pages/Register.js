import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    location: '',
    skills: []
  });
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const popularSkills = [
    'UI/UX Design',
    'Web Development',
    'Mobile App Development',
    'Graphic Design',
    'Logo Design',
    'Video Editing',
    'Content Writing',
    'Digital Marketing',
    'Social Media Management',
    'SEO Optimization',
    'Data Analysis',
    'Project Management',
    'Copywriting',
    'Photography',
    'Illustration'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role,
      skills: role === 'freelancer' ? prev.skills : []
    }));
  };

  const handleSkillAdd = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    if (!formData.location) {
      setError('Please enter your location');
      return;
    }

    if (formData.role === 'freelancer' && formData.skills.length === 0) {
      setError('Please add at least one skill for freelancer account');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        location: formData.location,
        skills: formData.skills
      };

      const res = await axios.post('http://localhost:5000/api/auth/register', requestData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
    <div className="register-container">
      <div className="register-content">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo-container hover-lift">
            <div className="register-logo-icon">
              <span className="register-logo-letter">G</span>
            </div>
            <span className="register-logo-text">GigConnect</span>
          </div>
          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">Join thousands of professionals</p>
        </div>

        {/* Card */}
        <div className="register-card">
          {error && (
            <div className="register-alert-error">
              {error}
            </div>
          )}

          {/* Google Sign Up */}
          <button 
            onClick={handleGoogleSignUp}
            className="register-btn-google"
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

          <div className="register-divider">
            <div className="register-divider-text">Or sign up with email</div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Information */}
            <div className="register-form-group">
              <label className="register-form-label">
                Full name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="register-form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="register-form-group">
              <label className="register-form-label">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="register-form-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="register-form-group">
              <label className="register-form-label">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="register-form-input"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div className="register-form-group">
              <label className="register-form-label">
                Confirm password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="register-form-input"
                placeholder="Confirm your password"
              />
            </div>

            {/* Role Selection */}
            <div className="register-form-group">
              <label className="register-form-label">
                I want to: *
              </label>
              <div className="role-selection-grid">
                <div 
                  className={`role-card ${formData.role === 'client' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('client')}
                >
                  <div className="role-icon">
                    💼
                  </div>
                  <span className="role-name">Hire Talent</span>
                </div>

                <div 
                  className={`role-card ${formData.role === 'freelancer' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('freelancer')}
                >
                  <div className="role-icon">
                    🚀
                  </div>
                  <span className="role-name">Offer Services</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="register-form-group">
              <label className="register-form-label">
                Your location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="register-form-input"
                placeholder="Enter your city and country"
              />
            </div>

            {/* Skills (only for freelancers) */}
            {formData.role === 'freelancer' && (
              <div className="register-form-group">
                <label className="register-form-label">
                  Your professional skills *
                </label>
                
                <div className="skills-container">
                  {/* Selected Skills Display */}
                  {formData.skills.length > 0 && (
                    <div className="selected-skills">
                      {formData.skills.map((skill, index) => (
                        <div 
                          key={index}
                          className="skill-tag"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="skill-remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Skills */}
                  <div className="add-skill-container">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      className="custom-skill-input"
                      placeholder="Type to add custom skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomSkillAdd())}
                    />
                    <button
                      type="button"
                      onClick={handleCustomSkillAdd}
                      disabled={!customSkill.trim()}
                      className="add-skill-btn"
                    >
                      Add Skill
                    </button>
                  </div>

                  {/* Popular Skills */}
                  <div>
                    <p className="popular-skills-label">Popular skills:</p>
                    <div className="popular-skills-grid">
                      {popularSkills.slice(0, 6).map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSkillAdd(skill)}
                          disabled={formData.skills.includes(skill)}
                          className="popular-skill-btn"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className={`register-btn-primary ${loading ? 'register-btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="register-link">
              Already have an account?{' '}
              <Link to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;