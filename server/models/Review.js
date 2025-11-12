import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    images: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Index for efficient querying
reviewSchema.index({ room: 1, user: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Virtual for average rating
reviewSchema.virtual('averageRating').get(function() {
    return this.rating;
});

// Method to check if user has already reviewed
reviewSchema.statics.hasUserReviewed = async function(userId, roomId) {
    const review = await this.findOne({ user: userId, room: roomId });
    return !!review;
};

// Method to get room's average rating
reviewSchema.statics.getRoomAverageRating = async function(roomId) {
    const result = await this.aggregate([
        { $match: { room: roomId, status: 'approved' } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    return result[0]?.averageRating || 0;
};

// Pre-save middleware to validate rating
reviewSchema.pre('save', function(next) {
    if (this.rating < 1 || this.rating > 5) {
        next(new Error('Rating must be between 1 and 5'));
    }
    next();
});

// Pre-save middleware to validate comment length
reviewSchema.pre('save', function(next) {
    if (this.comment.length < 10 || this.comment.length > 500) {
        next(new Error('Comment must be between 10 and 500 characters'));
    }
    next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
