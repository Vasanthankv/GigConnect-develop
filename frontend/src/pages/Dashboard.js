import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeGigs, setActiveGigs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [stats, setStats] = useState({
    activeGigs: 0,
    totalApplications: 0,
    messages: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (user?.role === 'client') {
        // Fetch client's gigs
        const gigsResponse = await axios.get('http://localhost:5000/api/gigs/client/my-gigs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActiveGigs(gigsResponse.data.gigs || []);
        
        const activeGigsCount = gigsResponse.data.gigs?.filter(gig => gig.status === 'active').length || 0;
        const totalApplications = gigsResponse.data.gigs?.reduce((total, gig) => total + (gig.applications?.length || 0), 0) || 0;
        
        setStats({
          activeGigs: activeGigsCount,
          totalApplications: totalApplications,
          messages: 0,
          earnings: 0
        });
      } else if (user?.role === 'freelancer') {
        // Fetch available gigs for freelancers
        const gigsResponse = await axios.get('http://localhost:5000/api/gigs?limit=5');
        setActiveGigs(gigsResponse.data.gigs || []);
        
        // Mock data for freelancer applications
        setRecentApplications([
          { id: 1, gigTitle: 'Website Redesign', status: 'pending', appliedDate: '2024-01-15' },
          { id: 2, gigTitle: 'Mobile App Development', status: 'accepted', appliedDate: '2024-01-10' }
        ]);
        
        setStats({
          activeGigs: gigsResponse.data.gigs?.length || 0,
          totalApplications: 2,
          messages: 3,
          earnings: 1250
        });
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your {user?.role === 'client' ? 'projects' : 'freelance work'} today.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-bolt p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.activeGigs}
            </div>
            <div className="text-gray-600 text-sm">
              {user?.role === 'client' ? 'Active Gigs' : 'Available Gigs'}
            </div>
          </div>
          
          <div className="card-bolt p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalApplications}
            </div>
            <div className="text-gray-600 text-sm">
              {user?.role === 'client' ? 'Total Applications' : 'My Applications'}
            </div>
          </div>
          
          <div className="card-bolt p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.messages}
            </div>
            <div className="text-gray-600 text-sm">
              New Messages
            </div>
          </div>
          
          <div className="card-bolt p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${stats.earnings}
            </div>
            <div className="text-gray-600 text-sm">
              {user?.role === 'client' ? 'Total Spent' : 'Total Earnings'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('gigs')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'gigs'
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {user?.role === 'client' ? 'My Gigs' : 'Available Gigs'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="card-bolt p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user?.role === 'client' ? (
                    <>
                      <Link 
                        to="/create-gig" 
                        className="card-bolt p-6 text-center group hover-lift"
                      >
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200 mx-auto">
                          <span className="text-xl group-hover:scale-110 transition-transform duration-200">💼</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Post New Gig</h3>
                        <p className="text-gray-600 text-sm">Find talented professionals for your project</p>
                      </Link>
                      
                      <div className="card-bolt p-6 text-center group hover-lift">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors duration-200 mx-auto">
                          <span className="text-xl group-hover:scale-110 transition-transform duration-200">📋</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Manage Gigs</h3>
                        <p className="text-gray-600 text-sm">View and manage your posted gigs</p>
                      </div>
                      
                      <div className="card-bolt p-6 text-center group hover-lift">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors duration-200 mx-auto">
                          <span className="text-xl group-hover:scale-110 transition-transform duration-200">👥</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Find Talent</h3>
                        <p className="text-gray-600 text-sm">Browse skilled freelancers</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/gigs" 
                        className="card-bolt p-6 text-center group hover-lift"
                      >
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors duration-200 mx-auto">
                          <span className="text-xl group-hover:scale-110 transition-transform duration-200">🔍</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Browse Gigs</h3>
                        <p className="text-gray-600 text-sm">Find projects that match your skills</p>
                      </Link>
                      
                      <div className="card-bolt p-6 text-center group hover-lift">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200 mx-auto">
                          <span className="text-xl group-hover:scale-110 transition-transform duration-200">👤</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">My Profile</h3>
                        <p className="text-gray-600 text-sm">Complete your profile to attract clients</p>
                      </div>
                      
                      <div className="card-bolt p-6 text-center group hover-lift">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors duration-200 mx-auto">
                          <span className="text-xl group-hover:scale-110 transition-transform duration-200">📊</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">My Applications</h3>
                        <p className="text-gray-600 text-sm">Track your gig applications</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card-bolt p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {user?.role === 'client' ? (
                    activeGigs.length > 0 ? (
                      activeGigs.slice(0, 3).map(gig => (
                        <div key={gig._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{gig.title}</h3>
                            <p className="text-sm text-gray-600">{gig.applications?.length || 0} applications</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            gig.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {gig.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No active gigs yet. <Link to="/create-gig" className="text-blue-600 hover:underline">Create your first gig</Link>
                      </p>
                    )
                  ) : (
                    recentApplications.length > 0 ? (
                      recentApplications.map(application => (
                        <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{application.gigTitle}</h3>
                            <p className="text-sm text-gray-600">Applied on {application.appliedDate}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            application.status === 'accepted' 
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No applications yet. <Link to="/gigs" className="text-blue-600 hover:underline">Browse available gigs</Link>
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Gigs Tab */}
          {activeTab === 'gigs' && (
            <div className="card-bolt p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.role === 'client' ? 'My Gigs' : 'Available Gigs'}
                </h2>
                {user?.role === 'client' && (
                  <Link to="/create-gig" className="btn-bolt-primary">
                    + New Gig
                  </Link>
                )}
              </div>
              
              <div className="space-y-4">
                {activeGigs.length > 0 ? (
                  activeGigs.map(gig => (
                    <div key={gig._id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{gig.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{gig.category}</p>
                          <p className="text-gray-700 mb-3 line-clamp-2">{gig.description}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          gig.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : gig.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {gig.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>💰</span>
                          <span>${gig.budget?.amount} {gig.budget?.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{gig.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span>{gig.location}</span>
                        </div>
                        {user?.role === 'client' && (
                          <div className="flex items-center gap-1">
                            <span>👥</span>
                            <span>{gig.applications?.length || 0} applications</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        {user?.role === 'client' ? (
                          <>
                            <button className="btn-bolt-secondary text-sm">
                              View Applications
                            </button>
                            <button className="btn-bolt-border text-sm">
                              Edit Gig
                            </button>
                          </>
                        ) : (
                          <button className="btn-bolt-primary text-sm">
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {user?.role === 'client' ? 'No gigs created yet' : 'No gigs available'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {user?.role === 'client' 
                        ? 'Start by creating your first gig to find talented freelancers.'
                        : 'Check back later for new opportunities.'
                      }
                    </p>
                    {user?.role === 'client' && (
                      <Link to="/create-gig" className="btn-bolt-primary">
                        Create Your First Gig
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;