import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'booking_request',
      'booking_confirmed',
      'booking_cancelled',
      'payment_received',
      'payment_failed',
      'review_received',
      'property_verified',
      'property_rejected',
      'message_received',
      'system_notification'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Property', 'Booking', 'Review', 'Message', 'Payment']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  actionUrl: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  return this.save();
};

// Static method to create system notification
notificationSchema.statics.createSystemNotification = async function(recipientId, title, message, priority = 'medium') {
  return this.create({
    recipient: recipientId,
    type: 'system_notification',
    title,
    message,
    priority
  });
};

// Static method to create booking notification
notificationSchema.statics.createBookingNotification = async function(recipientId, senderId, type, bookingId, title, message) {
  return this.create({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    message,
    relatedTo: {
      model: 'Booking',
      id: bookingId
    }
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 