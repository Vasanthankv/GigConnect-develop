const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
    minlength: 6
  },
  role: {
    type: String,
    enum: ['client', 'freelancer', ''],
    default: '' // Changed from 'client' to empty string
  },
  location: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  googleId: {
    type: String,
    sparse: true
  },
  isGoogleAuth: {
    type: Boolean,
    default: false
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isGoogleAuth || !this.password || !this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isGoogleAuth) {
    return true;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual to check if profile is complete
userSchema.virtual('needsRoleSelection').get(function() {
  return !this.role || this.role === '' || !this.isProfileComplete;
});

module.exports = mongoose.model('User', userSchema);