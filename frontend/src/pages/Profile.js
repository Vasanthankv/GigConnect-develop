import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    skills: [],
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
    hourlyRate: '',
    availability: 'available'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userData = response.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        location: userData.location || '',
        bio: userData.bio || '',
        skills: userData.skills || [],
        website: userData.website || '',
        twitter: userData.twitter || '',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        hourlyRate: userData.hourlyRate || '',
        availability: userData.availability || 'available'
      });

    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('Profile updated successfully!');
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your personal information and professional profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-bolt p-6">
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-black text-white rounded-lg font-medium">
                  Personal Info
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-600 hover:text-gray-900 rounded-lg font-medium transition-colors duration-200">
                  Security
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-600 hover:text-gray-900 rounded-lg font-medium transition-colors duration-200">
                  Notifications
                </button>
              </nav>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card-bolt p-8">
              {message && (
                <div className="alert-bolt-success mb-6">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert-bolt-error mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group-bolt">
                      <label className="form-label-bolt">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input-bolt"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="form-group-bolt">
                      <label className="form-label-bolt">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input-bolt"
                        placeholder="Your city and country"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="form-group-bolt">
                  <label className="form-label-bolt">Professional Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="form-input-bolt"
                    placeholder="Tell us about your professional background, skills, and experience..."
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    {formData.bio.length}/1000 characters
                  </p>
                </div>

                {/* Skills Display */}
                {user?.role === 'freelancer' && formData.skills.length > 0 && (
                  <div>
                    <label className="form-label-bolt">Your Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill, index) => (
                        <div 
                          key={index}
                          className="bg-black text-white px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      Skills can be updated from the role selection page
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group-bolt">
                      <label className="form-label-bolt">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="form-input-bolt"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="form-group-bolt">
                      <label className="form-label-bolt">Twitter</label>
                      <input
                        type="url"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="form-input-bolt"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="form-group-bolt">
                      <label className="form-label-bolt">LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="form-input-bolt"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="form-group-bolt">
                      <label className="form-label-bolt">GitHub</label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="form-input-bolt"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>

                {/* Freelancer Specific Fields */}
                {user?.role === 'freelancer' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Freelancer Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group-bolt">
                        <label className="form-label-bolt">Hourly Rate ($)</label>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          className="form-input-bolt"
                          placeholder="50"
                          min="0"
                        />
                      </div>
                      <div className="form-group-bolt">
                        <label className="form-label-bolt">Availability</label>
                        <select 
                          name="availability" 
                          value={formData.availability} 
                          onChange={handleChange}
                          className="form-select-bolt"
                        >
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    className={`btn-bolt-primary ${saving ? 'btn-loading' : ''}`}
                    disabled={saving}
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')}
                    className="btn-bolt-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;