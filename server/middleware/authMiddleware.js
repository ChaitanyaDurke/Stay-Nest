import jwt from 'jsonwebtoken';
import { asyncHandler } from './errorMiddleware.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again!'
    });
  }
});

// Restrict to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Check if user is property owner
export const isPropertyOwner = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    return res.status(404).json({
      status: 'error',
      message: 'Property not found'
    });
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have permission to perform this action'
    });
  }

  next();
}); 