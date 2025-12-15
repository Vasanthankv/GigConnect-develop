import React from 'react';
import { Link } from 'react-router-dom';

const HomeHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-gray-800">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
              GigConnect
            </span>
          </Link>

          {/* Navigation - Simplified for home page */}
          <nav className="flex items-center space-x-4">
            {user?.id ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 text-sm px-4 py-2 rounded-lg border border-transparent hover:border-gray-300"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 text-sm px-4 py-2 rounded-lg border border-transparent hover:border-gray-300"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="btn-bolt-primary text-sm"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;