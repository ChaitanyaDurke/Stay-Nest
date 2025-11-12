import { asyncHandler } from '../middleware/errorMiddleware.js';
import Property from '../models/Property.js';
import AppError from '../utils/appError.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// Create property
export const createProperty = asyncHandler(async (req, res, next) => {
  try {
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const propertyData = {
      ...req.body,
      owner: req.user._id,
    };

    if (imageUrl) {
      propertyData.images = [{
        url: imageUrl,
        publicId: imagePublicId,
        isMain: true,
      }];
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      status: 'success',
      data: property
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new AppError(`Invalid input data. ${messages.join('. ')}`, 400));
    } else {
      console.error("Error creating property:", error);
      return next(new AppError('Failed to create property. Please try again later.', 500));
    }
  }
});

// Get all properties with filters
export const getAllProperties = asyncHandler(async (req, res) => {
  const {
    location,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    amenities,
    sortBy,
    page = 1,
    limit = 10
  } = req.query;

  // Build query
  const query = {};
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  if (minPrice || maxPrice) {
    query['price.amount'] = {};
    if (minPrice) query['price.amount'].$gte = Number(minPrice);
    if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
  }
  if (bedrooms) {
    query['specifications.bedrooms'] = Number(bedrooms);
  }
  if (bathrooms) {
    query['specifications.bathrooms'] = Number(bathrooms);
  }
  if (amenities) {
    const amenityList = amenities.split(',');
    amenityList.forEach(amenity => {
      query[`amenities.${amenity}`] = true;
    });
  }

  // Execute query
  const properties = await Property.find(query)
    .sort(sortBy ? { [sortBy]: -1 } : { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('owner', 'name email');

  const total = await Property.countDocuments(query);

  res.json({
        status: 'success',
        results: properties.length,
    total,
    data: properties
    });
});

// Get single property
export const getProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('reviews');

    if (!property) {
    throw new AppError('Property not found', 404);
    }

  // Increment views
  property.views += 1;
  await property.save();

  res.json({
        status: 'success',
    data: property
    });
});

// Update property
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

    if (!property) {
    throw new AppError('Property not found', 404);
    }

  if (property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('You are not authorized to update this property', 403);
    }

  const updatedProperty = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
        status: 'success',
    data: updatedProperty
    });
});

// Delete property
export const deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
    throw new AppError('Property not found', 404);
    }

  if (property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('You are not authorized to delete this property', 403);
    }

  // Delete images from Cloudinary
  for (const image of property.images) {
    await deleteFromCloudinary(image.publicId);
  }

  await property.deleteOne();

  res.json({
        status: 'success',
        data: null
    });
});

// Get my properties
export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id });

  res.json({
    status: 'success',
    results: properties.length,
    data: properties
  });
});

// Upload property images
export const uploadPropertyImages = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('You are not authorized to upload images for this property', 403);
  }

  if (!req.files || req.files.length === 0) {
    throw new AppError('Please upload at least one image', 400);
  }

  const uploadPromises = req.files.map(file => uploadToCloudinary(file.path));
  const uploadResults = await Promise.all(uploadPromises);

  const newImages = uploadResults.map(result => ({
    url: result.secure_url,
    publicId: result.public_id,
    isMain: property.images.length === 0 // First image is main
  }));

  property.images.push(...newImages);
  await property.save();

  res.json({
    status: 'success',
    data: property
  });
});

// Delete property image
export const deletePropertyImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    throw new AppError('You are not authorized to delete images from this property', 403);
  }

  const image = property.images.id(req.params.imageId);
  if (!image) {
    throw new AppError('Image not found', 404);
  }

  await deleteFromCloudinary(image.publicId);
  image.remove();
  await property.save();

  res.json({
        status: 'success',
    data: property
    });
});

// Toggle favorite
export const toggleFavorite = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  const index = property.favorites.indexOf(req.user._id);
  if (index === -1) {
    property.favorites.push(req.user._id);
  } else {
    property.favorites.splice(index, 1);
  }

  await property.save();

  res.json({
    status: 'success',
    data: property
  });
});

// Get favorite properties
export const getFavoriteProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ favorites: req.user._id });

  res.json({
        status: 'success',
    results: properties.length,
    data: properties
    });
});
