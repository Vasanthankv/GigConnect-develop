import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/gigs/client/my-gigs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setGigs(response.data.gigs);
    } catch (err) {
      setError('Failed to load your gigs');
      console.error('Error fetching gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
            <p className="text-gray-600">
              Manage your posted projects and applications
            </p>
          </div>
          <Link
            to="/create-gig"
            className="btn-bolt-primary"
          >
            + Create New Gig
          </Link>
        </div>

        {error && (
          <div className="alert-bolt-error mb-6">
            {error}
          </div>
        )}

        {/* Gigs List */}
        <div className="space-y-6">
          {gigs.length > 0 ? (
            gigs.map(gig => (
              <div key={gig._id} className="card-bolt p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-xl">
                        {gig.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gig.status)}`}>
                        {getStatusLabel(gig.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {gig.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Category:</span>
                        <span>{gig.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Budget:</span>
                        <span className="font-semibold text-gray-900">
                          ${gig.budget} {gig.budgetType === 'fixed' ? 'Fixed' : '/hour'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Applications:</span>
                        <span className="font-semibold text-gray-900">
                          {gig.applications.length}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {gig.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {gig.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Posted {new Date(gig.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/gig/${gig._id}`}
                      className="btn-bolt-secondary text-sm"
                    >
                      View Details
                    </Link>
                    {gig.applications.length > 0 && (
                      <button className="btn-bolt-primary text-sm">
                        View Applications ({gig.applications.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card-bolt p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">💼</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No gigs posted yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start by creating your first gig to find talented professionals for your projects.
              </p>
              <Link
                to="/create-gig"
                className="btn-bolt-primary"
              >
                Create Your First Gig
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGigs;