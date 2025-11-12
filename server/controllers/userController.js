import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { createNotification } from './notificationController.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete account
export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Delete user's avatar from cloudinary if exists
  if (user.avatar && user.avatar.public_id) {
    await uploadToCloudinary(user.avatar.public_id, 'avatars');
  }

  // Delete user's properties and their images
  const properties = await Property.find({ owner: user._id });
  for (const property of properties) {
    // Delete property images from cloudinary
    for (const image of property.images) {
      await uploadToCloudinary(image.public_id, 'properties');
    }
    await property.deleteOne();
  }

  // Delete user's bookings
  await Booking.deleteMany({ user: user._id });

  // Delete user's reviews
  await Review.deleteMany({ user: user._id });

  // Delete user's notifications
  await Notification.deleteMany({ 
    $or: [
      { recipientId: user._id },
      { senderId: user._id }
    ]
  });

  // Delete user's favorites
  await Property.updateMany(
    { favorites: user._id },
    { $pull: { favorites: user._id } }
  );

  // Finally delete the user
  await user.deleteOne();

  res.json({
    status: 'success',
    message: 'Account deleted successfully'
  });
});

// Get my favorites
export const getMyFavorites = asyncHandler(async (req, res) => {
  const properties = await Property.find({ favorites: req.user._id })
    .populate('owner', 'name email')
    .sort('-createdAt');

  res.json({
    status: 'success',
    results: properties.length,
    data: properties
  });
});

// Get my notifications
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientId: req.user._id })
    .populate('senderId', 'name avatar')
    .sort('-createdAt');

  res.json({
    status: 'success',
    results: notifications.length,
    data: notifications
  });
});

// Get profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate({
      path: 'properties',
      select: 'title images price location rating',
      options: { limit: 5 }
    });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Update notification preferences
export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const { emailNotifications, pushNotifications } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      notificationPreferences: {
        email: emailNotifications,
        push: pushNotifications
      }
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Update password
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if current password is correct
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);

  res.json({
    status: 'success',
    message: 'Password updated successfully',
    token
  });
});

// Update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, bio } = req.body;

  // Check if email is already taken by another user
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      throw new AppError('Email is already in use', 400);
    }
  }

  // Handle avatar upload if present
  let avatarData;
  if (req.file) {
    // Delete old avatar if exists
    if (req.user.avatar && req.user.avatar.public_id) {
      await uploadToCloudinary(req.user.avatar.public_id, 'avatars');
    }

    // Upload new avatar
    const result = await uploadToCloudinary(req.file.path, 'avatars');

    avatarData = {
      url: result.secure_url,
      public_id: result.public_id
    };
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      bio: bio || req.user.bio,
      ...(avatarData && { avatar: avatarData })
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Get current user profile
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Update current user profile
export const updateMe = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  // Don't allow password updates through this route
  if (req.body.password) {
    throw new AppError('This route is not for password updates. Please use /updatePassword', 400);
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, phone, address },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Delete current user
export const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.json({
    status: 'success',
    data: null
  });
});

// Upload profile picture
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload an image', 400);
  }

  // Upload to Cloudinary
  const result = await uploadToCloudinary(req.file.path, 'profile_pictures');

  // Update user profile picture
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: result.secure_url },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Get all users (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.json({
    status: 'success',
    results: users.length,
    data: users
  });
});

// Get user by ID (admin only)
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Update user (admin only)
export const updateUser = asyncHandler(async (req, res) => {
  // Don't allow password updates through this route
  if (req.body.password) {
    throw new AppError('This route is not for password updates. Please use /updatePassword', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: user
  });
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: null
  });
});