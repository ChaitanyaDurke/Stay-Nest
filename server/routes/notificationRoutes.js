import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get user notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

// Get notification preferences
router.get('/preferences', getNotificationPreferences);

// Update notification preferences
router.patch('/preferences', updateNotificationPreferences);

export default router; 