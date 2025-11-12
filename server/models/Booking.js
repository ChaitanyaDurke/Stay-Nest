import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Populate property and user automatically when querying
bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'property',
        select: 'title price images'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
