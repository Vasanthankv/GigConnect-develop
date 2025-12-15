const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'web-development',
      'mobile-development', 
      'graphic-design',
      'content-writing',
      'digital-marketing',
      'video-editing',
      'photo-editing',
      'data-analysis',
      'customer-support',
      'other'
    ]
  },
  skillsRequired: {
    type: [String],
    required: true
  },
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  duration: {
    type: String,
    enum: ['less-than-week', '1-2-weeks', '2-4-weeks', '1-3-months', '3+months'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'in-progress', 'completed', 'cancelled'],
    default: 'active'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedFreelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
gigSchema.index({ client: 1, createdAt: -1 });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ skillsRequired: 1 });

module.exports = mongoose.model('Gig', gigSchema);