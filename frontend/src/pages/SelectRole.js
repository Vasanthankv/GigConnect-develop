import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const popularSkills = [
    'UI/UX Design', 'Web Development', 'Mobile App Development', 'Graphic Design',
    'Logo Design', 'Video Editing', 'Content Writing', 'Digital Marketing',
    'Social Media Management', 'SEO Optimization', 'Data Analysis', 'Project Management'
  ];

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      setUserData(JSON.parse(user));
    } else {
      // If no user data, check if user is logged in
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUserData(JSON.parse(storedUser));
      } else {
        navigate('/login');
      }
    }
  }, [navigate, searchParams]);

  const handleRoleSelect = async (e) => {
    e.preventDefault();
    
    if (!selectedRole || !location) {
      setError('Please select a role and enter your location');
      return;
    }

    if (selectedRole === 'freelancer' && skills.length === 0) {
      setError('Please add at least one skill for freelancer account');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Update user with selected role and location
      const response = await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        {
          role: selectedRole,
          location: location,
          skills: skills
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update user in localStorage
      const updatedUser = {
        ...userData,
        role: selectedRole,
        location: location,
        skills: skills,
        isProfileComplete: true
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6 hover-lift">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-105">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">GigConnect</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Profile</h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Welcome, {userData.name}! Tell us how you'd like to use GigConnect.
          </p>
        </div>

        {/* Role Selection Card */}
        <div className="card-bolt p-8">
          {error && (
            <div className="alert-bolt-error mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleRoleSelect} className="space-y-8">
            {/* Role Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                I want to: *
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Option */}
                <div 
                  className={`card-bolt p-6 cursor-pointer transition-all duration-200 ${
                    selectedRole === 'client' 
                      ? 'border-2 border-black bg-gray-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole('client')}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      selectedRole === 'client' ? 'bg-black' : 'bg-gray-100'
                    }`}>
                      <span className={`text-xl ${selectedRole === 'client' ? 'text-white' : 'text-gray-600'}`}>
                        💼
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Hire Talent</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Find and work with skilled professionals for your projects and business needs.
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedRole === 'client' 
                        ? 'border-black bg-black' 
                        : 'border-gray-300'
                    }`}>
                      {selectedRole === 'client' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Freelancer Option */}
                <div 
                  className={`card-bolt p-6 cursor-pointer transition-all duration-200 ${
                    selectedRole === 'freelancer' 
                      ? 'border-2 border-black bg-gray-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole('freelancer')}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      selectedRole === 'freelancer' ? 'bg-black' : 'bg-gray-100'
                    }`}>
                      <span className={`text-xl ${selectedRole === 'freelancer' ? 'text-white' : 'text-gray-600'}`}>
                        🚀
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Offer Services</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Showcase your skills and find freelance work with top companies and clients.
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedRole === 'freelancer' 
                        ? 'border-black bg-black' 
                        : 'border-gray-300'
                    }`}>
                      {selectedRole === 'freelancer' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Input */}
            <div className="form-group-bolt">
              <label className="form-label-bolt">
                Your location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input-bolt"
                placeholder="Enter your city and country"
                required
              />
              <p className="text-gray-500 text-xs mt-2">
                This helps us match you with relevant opportunities in your area
              </p>
            </div>

            {/* Skills Input (only for freelancers) */}
            {selectedRole === 'freelancer' && (
              <div className="form-group-bolt">
                <label className="form-label-bolt">
                  Your professional skills *
                </label>
                
                {/* Selected Skills Display */}
                {skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div 
                          key={index}
                          className="bg-black text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:bg-gray-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="w-4 h-4 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Skills */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="form-input-bolt flex-1"
                    placeholder="Type to add custom skill"
                  />
                  <button
                    type="button"
                    onClick={handleCustomSkillAdd}
                    disabled={!customSkill.trim()}
                    className="btn-bolt-secondary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>

                {/* Popular Skills */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.slice(0, 6).map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSkillAdd(skill)}
                        disabled={skills.includes(skill)}
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-gray-500 text-xs mt-3">
                  Select from popular skills or add your own. This helps clients find you for relevant projects.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`btn-bolt-primary w-full text-lg py-4 ${
                loading ? 'btn-loading' : ''
              } ${
                !selectedRole || !location ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || !selectedRole || !location}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Completing your profile...
                </div>
              ) : (
                'Complete Profile & Continue'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              You can always change this later in your profile settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;