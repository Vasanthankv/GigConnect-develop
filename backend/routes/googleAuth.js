const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Check if Google OAuth is configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured'
    });
  }
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  if (!isGoogleConfigured) {
    return res.redirect('http://localhost:3000/login?error=google_not_configured');
  }
  
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/login?error=auth_failed',
    session: false 
  })(req, res, next);
}, async (req, res) => {
  try {
    const user = req.user;
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Check if user needs to select role (new Google user or existing user without role)
    const needsRoleSelection = !user.role || user.role === '' || !user.isProfileComplete;
    
    if (needsRoleSelection) {
      console.log('User needs role selection:', user.email);
      // Redirect to role selection page
      const userData = encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || '',
        location: user.location || '',
        profilePicture: user.profilePicture || '',
        isProfileComplete: user.isProfileComplete
      }));
      
      res.redirect(`http://localhost:3000/select-role?token=${token}&user=${userData}`);
    } else {
      console.log('Existing user with complete profile:', user.email);
      // User has complete profile, redirect to dashboard
      const userData = encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        skills: user.skills,
        profilePicture: user.profilePicture,
        isProfileComplete: user.isProfileComplete
      }));
      
      res.redirect(`http://localhost:3000/auth/success?token=${token}&user=${userData}&redirect=dashboard`);
    }
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect('http://localhost:3000/login?error=auth_failed');
  }
});

// Get Google OAuth URL (for frontend button)
router.get('/google/url', (req, res) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured. Please check your environment variables.'
    });
  }
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent('http://localhost:5000/api/auth/google/callback')}&` +
    `response_type=code&` +
    `scope=profile email&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  res.json({ 
    success: true,
    authUrl 
  });
});

module.exports = router;