import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  uploadPropertyImages,
  deletePropertyImage,
  toggleFavorite,
  getFavoriteProperties
} from '../controllers/propertyController.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getProperty);

// Protected routes
router.use(protect);

// Property owner routes
router.post('/', upload.single('imageFile'), createProperty);
router.get('/my-properties', getMyProperties);
router.patch('/:id', updateProperty);
router.delete('/:id', deleteProperty);

// Image management
router.post('/:id/images', upload.array('images', 5), uploadPropertyImages);
router.delete('/:id/images/:imageId', deletePropertyImage);

// Favorites
router.patch('/:id/favorite', toggleFavorite);
router.get('/favorites', getFavoriteProperties);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/admin/all', getAllProperties);

export default router; 