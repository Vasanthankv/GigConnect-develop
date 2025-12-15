const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proposal: {
    type: String,
    required: true,
    maxlength: 2000
  },
  bidAmount: {
    type: Number,
    required: true,
    min: 1
  },
  estimatedDays: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ gig: 1, freelancer: 1 }, { unique: true });

// Add text search index for proposals
applicationSchema.index({ proposal: 'text', coverLetter: 'text' });

// Virtual for formatted created date
applicationSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Method to check if application can be withdrawn
applicationSchema.methods.canWithdraw = function() {
  return this.status === 'pending';
};

// Method to check if application can be accepted/rejected
applicationSchema.methods.canAcceptReject = function() {
  return this.status === 'pending';
};

module.exports = mongoose.model('Application', applicationSchema);