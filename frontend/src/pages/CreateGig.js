import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skillsRequired: [],
    budget: {
      type: 'fixed',
      amount: '',
      currency: 'USD'
    },
    duration: '',
    location: ''
  });
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const popularSkills = [
    'React', 'Node.js', 'JavaScript', 'Python', 'UI/UX Design',
    'Graphic Design', 'Content Writing', 'Digital Marketing', 'SEO',
    'Video Editing', 'Mobile Development', 'Web Development'
  ];

  const categories = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'graphic-design', label: 'Graphic Design' },
    { value: 'content-writing', label: 'Content Writing' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'video-editing', label: 'Video Editing' },
    { value: 'photo-editing', label: 'Photo Editing' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'customer-support', label: 'Customer Support' },
    { value: 'other', label: 'Other' }
  ];

  const durations = [
    { value: 'less-than-week', label: 'Less than 1 week' },
    { value: '1-2-weeks', label: '1-2 weeks' },
    { value: '2-4-weeks', label: '2-4 weeks' },
    { value: '1-3-months', label: '1-3 months' },
    { value: '3+months', label: '3+ months' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('budget.')) {
      const budgetField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        budget: {
          ...prev.budget,
          [budgetField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillAdd = (skill) => {
    if (!formData.skillsRequired.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleCustomSkillAdd = () => {
    if (customSkill.trim() && !formData.skillsRequired.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSkillAdd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.description || !formData.category || 
        !formData.budget.amount || !formData.duration || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.skillsRequired.length === 0) {
      setError('Please add at least one required skill');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/gigs',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create gig. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Gig</h1>
          <p className="text-gray-600">
            Post your project and find the perfect freelancer for the job
          </p>
        </div>

        {/* Form */}
        <div className="card-bolt p-8">
          {error && (
            <div className="alert-bolt-error mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-group-bolt">
              <label className="form-label-bolt">
                Gig Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input-bolt"
                placeholder="e.g., Need a React Developer for E-commerce Website"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group-bolt">
              <label className="form-label-bolt">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="form-input-bolt"
                placeholder="Describe your project in detail. Include goals, requirements, and any specific needs..."
                required
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group-bolt">
                <label className="form-label-bolt">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select-bolt"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-bolt">
                <label className="form-label-bolt">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input-bolt"
                  placeholder="e.g., Remote, New York, London"
                  required
                />
              </div>
            </div>

            {/* Skills Required */}
            <div className="form-group-bolt">
              <label className="form-label-bolt">
                Skills Required *
              </label>
              
              {/* Selected Skills */}
              {formData.skillsRequired.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsRequired.map((skill, index) => (
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
                  onKeyPress={handleKeyPress}
                  className="form-input-bolt flex-1"
                  placeholder="Type to add custom skill"
                />
                <button
                  type="button"
                  onClick={handleCustomSkillAdd}
                  disabled={!customSkill.trim()}
                  className="btn-bolt-secondary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Skill
                </button>
              </div>

              {/* Popular Skills */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSkillAdd(skill)}
                      disabled={formData.skillsRequired.includes(skill)}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group-bolt">
                <label className="form-label-bolt">
                  Budget Type *
                </label>
                <select
                  name="budget.type"
                  value={formData.budget.type}
                  onChange={handleChange}
                  className="form-select-bolt"
                  required
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div className="form-group-bolt">
                <label className="form-label-bolt">
                  {formData.budget.type === 'fixed' ? 'Fixed Budget' : 'Hourly Rate'} *
                </label>
                <div className="flex gap-2">
                  <select
                    name="budget.currency"
                    value={formData.budget.currency}
                    onChange={handleChange}
                    className="form-select-bolt w-24"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    name="budget.amount"
                    value={formData.budget.amount}
                    onChange={handleChange}
                    className="form-input-bolt flex-1"
                    placeholder={formData.budget.type === 'fixed' ? 'e.g., 500' : 'e.g., 25'}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="form-group-bolt">
              <label className="form-label-bolt">
                Project Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-select-bolt"
                required
              >
                <option value="">Select duration</option>
                {durations.map(duration => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-bolt-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn-bolt-primary flex-1 ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? 'Creating Gig...' : 'Create Gig'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;