import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from './notificationController.js';

// Middleware to set property and user IDs for nested routes
export const setPropertyUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.property) req.body.property = req.params.propertyId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

// Get all reviews for a property
export const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find()
        .populate('user', 'name')
        .populate('property', 'title')
        .sort('-createdAt');

    res.json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});

// Get a single review
export const getReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)
        .populate('user', 'name')
        .populate('property', 'title');

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    res.json({
        status: 'success',
        data: review
    });
});

// Create review
export const createReview = asyncHandler(async (req, res) => {
    const { propertyId, rating, comment } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
        throw new AppError('Property not found', 404);
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({
        user: req.user._id,
        property: propertyId
    });

    if (existingReview) {
        throw new AppError('You have already reviewed this property', 400);
    }

    // Create review
    const review = await Review.create({
        user: req.user._id,
        property: propertyId,
        rating,
        comment
    });

    // Update property rating
    const reviews = await Review.find({ property: propertyId });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    property.rating = totalRating / reviews.length;
    await property.save();

    // Create notification for property owner
    await createNotification({
        recipientId: property.owner,
        senderId: req.user._id,
        type: 'review',
        title: 'New Review',
        message: `You have received a new review for ${property.title}`,
        relatedTo: {
            type: 'review',
            id: review._id
        }
    });

    res.status(201).json({
        status: 'success',
        data: review
    });
});

// Get property reviews
export const getPropertyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ property: req.params.propertyId })
        .populate('user', 'name')
        .sort('-createdAt');

    res.json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});

// Update review
export const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id)
        .populate('property');

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check if user is authorized to update this review
    if (review.user.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to update this review', 403);
    }

    // Update review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update property rating
    const reviews = await Review.find({ property: review.property._id });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    review.property.rating = totalRating / reviews.length;
    await review.property.save();

    res.json({
        status: 'success',
        data: review
    });
});

// Delete review
export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)
        .populate('property');

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check if user is authorized to delete this review
    if (review.user.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to delete this review', 403);
    }

    await review.deleteOne();

    // Update property rating
    const reviews = await Review.find({ property: review.property._id });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    review.property.rating = reviews.length > 0 ? totalRating / reviews.length : 0;
    await review.property.save();

    res.json({
        status: 'success',
        data: null
    });
});

// Get my reviews
export const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate('property', 'title')
        .sort('-createdAt');

    res.json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});
