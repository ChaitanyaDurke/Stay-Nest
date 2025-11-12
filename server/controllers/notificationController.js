import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// Get user notifications
export const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const skip = (page - 1) * limit;

  const query = { recipient: req.user._id };
  if (unreadOnly === 'true') {
    query.read = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('sender', 'name email')
    .populate('relatedTo.id');

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    read: false
  });

  res.json({
    status: 'success',
    data: {
      notifications,
      total,
      unreadCount,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Mark notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: req.user._id
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  notification.read = true;
  await notification.save();

  res.json({
    status: 'success',
    data: notification
  });
});

// Mark all notifications as read
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );

  res.json({
    status: 'success',
    message: 'All notifications marked as read'
  });
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: req.user._id
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  res.json({
    status: 'success',
    message: 'Notification deleted successfully'
  });
});

// Create notification (internal use)
export const createNotification = asyncHandler(async ({
  recipientId,
  senderId,
  type,
  title,
  message,
  relatedTo,
  priority = 'medium',
  sendEmail = false
}) => {
  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    message,
    relatedTo,
    priority
  });

  if (sendEmail) {
    const user = await User.findById(recipientId);
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: title,
        text: message
      });
    }
  }

  return notification;
});

// Get notification preferences
export const getNotificationPreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('notificationPreferences');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user.notificationPreferences
  });
});

// Update notification preferences
export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const { preferences } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { notificationPreferences: preferences },
    { new: true }
  ).select('notificationPreferences');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user.notificationPreferences
  });
}); 