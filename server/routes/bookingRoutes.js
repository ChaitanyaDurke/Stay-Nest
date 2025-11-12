import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getBooking,
  getMyBookings,
  updateBookingStatus,
  cancelBooking,
  getPropertyBookings,
  getAllBookings,
  getRecentBookings
} from '../controllers/bookingController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Public routes
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);
router.delete('/:id', cancelBooking);
router.get('/property/:propertyId', getPropertyBookings);
router.get('/recent', getRecentBookings);

// Admin only routes
router.get('/', restrictTo('admin'), getAllBookings);

export default router; 