import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
  getMyFavorites,
  getMyNotifications,
  updateNotificationPreferences
} from '../controllers/userController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/password', updatePassword);
router.delete('/account', deleteAccount);

// Favorites
router.get('/favorites', getMyFavorites);

// Notifications
router.get('/notifications', getMyNotifications);
router.patch('/notification-preferences', updateNotificationPreferences);

export default router; 