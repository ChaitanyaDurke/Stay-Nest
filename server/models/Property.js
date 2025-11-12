import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
        type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
        type: String,
      required: [true, "Description is required"],
    },
    location: {
        type: String,
      required: [true, "Location is required"],
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      country: String,
    },
    coordinates: {
        latitude: Number,
      longitude: Number,
    },
    price: {
        amount: {
            type: Number,
        required: [true, "Price is required"],
        },
        currency: {
            type: String,
        default: "INR",
        },
        period: {
            type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "daily",
      },
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        publicId: String,
        isMain: {
            type: Boolean,
          default: false,
        },
      },
    ],
    amenities: {
        wifi: { type: Boolean, default: false },
        tv: { type: Boolean, default: false },
        ac: { type: Boolean, default: false },
        kitchen: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        elevator: { type: Boolean, default: false },
        security: { type: Boolean, default: false },
        pool: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
    },
    specifications: {
      bedrooms: {
        type: Number,
        required: [true, "Please specify number of bedrooms"],
      },
      bathrooms: {
        type: Number,
        required: [true, "Please specify number of bathrooms"],
      },
      area: {
        type: Number,
        required: [true, "Please specify property size in sq.ft"],
      },
        floor: { type: Number },
        totalFloors: { type: Number },
        furnishing: {
        type: String,
        enum: ["unfurnished", "semi-furnished", "fully-furnished"],
        default: "unfurnished",
      },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
        type: String,
      enum: ["available", "booked", "maintenance", "unavailable"],
      default: "available",
    },
    rating: {
        average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    rules: [String],
    nearbyPlaces: [
      {
        name: String,
        type: String,
        distance: Number,
      },
    ],
    verification: {
        isVerified: { type: Boolean, default: false },
        verifiedAt: Date,
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    featured: {
        isFeatured: { type: Boolean, default: false },
      featuredUntil: Date,
    },
    views: { type: Number, default: 0 },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
        type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Indexes for better search performance
propertySchema.index({ title: "text", description: "text", location: "text" });
propertySchema.index({ "address.city": 1 });
propertySchema.index({ "price.amount": 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ "specifications.bedrooms": 1 });
propertySchema.index({ "specifications.bathrooms": 1 });

// Virtual for property age
propertySchema.virtual("age").get(function () {
  return Math.floor(
    (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24 * 365)
  );
});

// Method to update rating
propertySchema.methods.updateRating = async function () {
  const reviews = await this.model("Review").find({ property: this._id });
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / reviews.length;
    this.rating.count = reviews.length;
    await this.save();
};

// Method to check availability
propertySchema.methods.isAvailable = function (startDate, endDate) {
  if (this.status !== "available") return false;
    
  return !this.bookings.some((booking) => {
    return startDate <= booking.endDate && endDate >= booking.startDate;
    });
};

// Virtual populate reviews
propertySchema.virtual("reviews", {
  ref: "Review",
  foreignField: "property",
  localField: "_id",
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
