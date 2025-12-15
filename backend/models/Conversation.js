const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure unique conversations between users for a gig
conversationSchema.index({ participants: 1, gig: 1 }, { unique: true });

// Index for sorting by last message
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.virtual('unreadCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversation',
  match: { isRead: false }
});

module.exports = mongoose.model('Conversation', conversationSchema);