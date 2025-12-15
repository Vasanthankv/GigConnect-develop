import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const redirect = searchParams.get('redirect');

    if (token && user) {
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      
      const userData = JSON.parse(user);
      
      // Check where to redirect
      if (redirect === 'dashboard') {
        // Direct to dashboard for users with complete profiles
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Check if user needs to select role
        if (!userData.role || userData.role === '' || !userData.isProfileComplete) {
          // Redirect to role selection
          setTimeout(() => {
            navigate('/select-role');
          }, 1000);
        } else {
          // Redirect to dashboard for existing users with complete profiles
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      }
    } else {
      // If no token, redirect to login
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="card-bolt p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✅</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Welcome to GigConnect! Redirecting you...
          </p>
          
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;