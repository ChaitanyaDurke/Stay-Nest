import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { createNotification } from './notificationController.js';

// Helper function to calculate the number of days between two dates
const calculateNights = (checkIn, checkOut) => {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Create booking
export const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, guests, totalPrice } = req.body;

  // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
    throw new AppError('Property not found', 404);
    }

  // Check if property is available for the selected dates
  const overlappingBookings = await Booking.find({
    property: propertyId,
    status: { $in: ['confirmed', 'pending', 'approved'] },
    $or: [
      // Existing booking starts during the new booking
      {
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) }
      },
      // New booking starts during an existing booking
      {
        checkIn: { $lte: new Date(checkIn) },
        checkOut: { $gte: new Date(checkIn) }
      },
      // New booking ends during an existing booking
      {
        checkIn: { $lte: new Date(checkOut) },
        checkOut: { $gte: new Date(checkOut) }
      }
    ]
  });

  // Check if property has capacity for the requested guests
  if (guests > property.maxGuests) {
    throw new AppError(`This property can only accommodate up to ${property.maxGuests} guests`, 400);
  }

  // Calculate total capacity of overlapping bookings including the new one
  const totalGuests = overlappingBookings.reduce((sum, booking) => sum + booking.guests, 0);
  
  if (overlappingBookings.length > 0) {
    if (totalGuests + guests > property.maxGuests) {
      throw new AppError('The property does not have enough capacity for the selected dates', 400);
    }
  }

  // Create booking
  const booking = await Booking.create({
        user: req.user._id,
    property: propertyId,
    checkIn,
    checkOut,
    guests,
        totalPrice
    });

  // Create notification for property owner
  await createNotification({
    recipientId: property.owner,
    senderId: req.user._id,
    type: 'booking',
    title: 'New Booking Request',
    message: `You have a new booking request for ${property.title}`,
    relatedTo: {
      type: 'booking',
      id: booking._id
    }
  });

  res.status(201).json({
    status: 'success',
    data: booking
  });
});

// Get booking by ID
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('property');

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user is authorized to view this booking
  if (booking.user._id.toString() !== req.user._id.toString() && 
      booking.property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to view this booking', 403);
  }

  res.json({
    status: 'success',
    data: booking
  });
});

// Get user's bookings
export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('property')
        .sort('-createdAt');

  res.json({
    status: 'success',
    results: bookings.length,
    data: bookings
  });
});

// Update booking status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id)
    .populate('property')
    .populate('user', 'name email');

    if (!booking) {
    throw new AppError('Booking not found', 404);
    }

  // Check if user is authorized to update this booking
  if (booking.property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this booking', 403);
    }

  // Update booking status
  booking.status = status;
  await booking.save();

  // Create notification for user
  await createNotification({
    recipientId: booking.user._id,
    senderId: req.user._id,
    type: 'booking',
    title: 'Booking Status Updated',
    message: `Your booking for ${booking.property.title} has been ${status}`,
    relatedTo: {
      type: 'booking',
      id: booking._id
    }
  });

  res.json({
    status: 'success',
    data: booking
  });
});

// Cancel booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property')
    .populate('user', 'name email');

    if (!booking) {
    throw new AppError('Booking not found', 404);
    }

  // Check if user is authorized to cancel this booking
  if (booking.user._id.toString() !== req.user._id.toString() && 
      booking.property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to cancel this booking', 403);
    }

  // Update booking status
    booking.status = 'cancelled';
    await booking.save();

  // Create notification
  const recipientId = booking.user._id.toString() === req.user._id.toString() 
    ? booking.property.owner 
    : booking.user._id;

  await createNotification({
    recipientId,
    senderId: req.user._id,
    type: 'booking',
    title: 'Booking Cancelled',
    message: `Booking for ${booking.property.title} has been cancelled`,
    relatedTo: {
      type: 'booking',
      id: booking._id
    }
  });

  res.json({
        status: 'success',
    data: booking
    });
});

// Get property bookings (owner only)
export const getPropertyBookings = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.propertyId);

  if (!property) {
    throw new AppError('Property not found', 404);
    }

  // Check if user is the property owner
  if (property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to view these bookings', 403);
    }

  const bookings = await Booking.find({ property: req.params.propertyId })
    .populate('user', 'name email')
    .sort('-createdAt');

  res.json({
    status: 'success',
    results: bookings.length,
    data: bookings
  });
});

// Get all bookings (admin only)
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('property', 'title')
    .sort('-createdAt');

  res.json({
        status: 'success',
    results: bookings.length,
    data: bookings
    });
});

// Get recent bookings for the current user
export const getRecentBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('property', 'title location images');

  res.json({
    status: 'success',
    data: bookings
  });
});
