import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  getPropertyReviews,
  getMyReviews
} from '../controllers/reviewController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Review routes
router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.get('/my-reviews', getMyReviews);
router.get('/property/:propertyId', getPropertyReviews);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router; 