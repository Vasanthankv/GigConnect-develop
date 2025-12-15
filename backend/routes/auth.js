const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, skills } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'client',
      location: location || '',
      skills: role === 'freelancer' ? (skills || []) : [],
      isProfileComplete: true
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        skills: user.skills,
        profilePicture: user.profilePicture,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        skills: user.skills,
        profilePicture: user.profilePicture,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Get Current User Profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        location: req.user.location,
        skills: req.user.skills,
        profilePicture: req.user.profilePicture,
        isProfileComplete: req.user.isProfileComplete
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Update User Profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { role, location, skills } = req.body;
    
    // Validate role
    if (!role || !['client', 'freelancer'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid role is required' 
      });
    }

    // Validate location
    if (!location || location.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Location is required' 
      });
    }

    // Validate skills for freelancers
    if (role === 'freelancer' && (!skills || skills.length === 0)) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one skill is required for freelancers' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        role, 
        location: location.trim(), 
        skills: role === 'freelancer' ? skills : [],
        isProfileComplete: true 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        skills: user.skills,
        profilePicture: user.profilePicture,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile update' 
    });
  }
});

module.exports = router;