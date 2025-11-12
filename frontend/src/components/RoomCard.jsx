import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  faStar, 
  faWifi, 
  faTv, 
  faElevator, 
  faBed, 
  faBath,
  faSnowflake,
  faParking,
  faUtensils,
  faFireExtinguisher,
  faPlug,
  faCheckCircle,
  faLocationDot,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PaymentForm from './PaymentForm';
import BookingConfirmation from './BookingConfirmation';

const RoomCard = ({ room, designId, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showDateWarning, setShowDateWarning] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return faWifi;
      case 'tv': return faTv;
      case 'elevator': return faElevator;
      case 'bed': return faBed;
      case 'bath': return faBath;
      case 'ac': return faSnowflake;
      case 'parking': return faParking;
      case 'kitchen': return faUtensils;
      case 'security': return faFireExtinguisher;
      case 'work desk': return faPlug;
      case 'pool': return faCheckCircle;
      default: return faCheckCircle;
    }
  };

  const handleViewDetails = () => {
    navigate(`/properties/${room.id}`, { 
      state: { 
        roomData: room,
        from: 'roomlist'
      }
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${room.title}?`)) {
      try {
        await api.delete(`/properties/${room._id}`);
        toast.success('Room deleted successfully!', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (error) {
        console.error('Error deleting room:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to delete room.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      }
    }
  };

  const handleBookNowClick = () => {
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setShowPaymentForm(false);
    setCheckInDate(null);
    setCheckOutDate(null);
    setShowDateWarning(false);
    setBookingResult(null);
    setShowConfirmationModal(false);
  };

  const handleConfirmDates = () => {
    if (!checkInDate || !checkOutDate) {
      setShowDateWarning(true);
      toast.error('Please select both check-in and check-out dates.');
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async () => {
    console.log('handlePaymentSuccess called from RoomCard.');
    console.log('Room ID:', room._id);
    console.log('Check-in Date (before API):', checkInDate);
    console.log('Check-out Date (before API):', checkOutDate);
    console.log('Total Price (before API):', finalPrice);
    try {
      const bookingData = {
        propertyId: room._id, 
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: room.maxGuests || (room.amenities.bed * 2) || 1,
        totalPrice: finalPrice,
      };

      console.log('Sending booking data:', bookingData);
      const response = await api.post('/bookings', bookingData);
      console.log('Booking API response:', response.data);

      setBookingResult({
        bookingId: response.data.data._id.slice(-6).toUpperCase(),
        bookingDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        hotelName: room.title,
        checkInDate: checkInDate.toLocaleDateString('en-US'),
        checkOutDate: checkOutDate.toLocaleDateString('en-US'),
        totalFare: finalPrice,
      });
      setShowPaymentForm(false);
      setShowBookingModal(false);
      setShowConfirmationModal(true);

      toast.success('Booking successful!');
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'An error occurred during booking. Please try again.');
    }
  };

  const days = (checkInDate && checkOutDate) ? (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24) : 0;
  const basePricePerNight = room.price && room.price.amount ? room.price.amount : 0;
  const totalBasePrice = basePricePerNight * days;
  const taxesAndFees = totalBasePrice * 0.18;
  const finalPrice = totalBasePrice + taxesAndFees;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300"
      >
        <Toaster />
        <motion.div 
          className="w-full md:w-1/3 h-48 md:h-auto relative"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={
              room.images && room.images.length > 0
                ? (typeof room.images[0] === 'string'
                    ? room.images[0]
                    : room.images[0].url || 'https://via.placeholder.com/400x300?text=No+Image+Available')
                : 'https://via.placeholder.com/400x300?text=No+Image+Available'
            }
            alt={room.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Room+Image';
            }}
          />
          {room.isCompanyServiced && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10"
            >
              Company-Serviced
            </motion.span>
          )}
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10"
          >
            {room.roomType}
          </motion.span>
        </motion.div>
        
        <div className="p-4 md:p-6 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{room.title}</h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
              <span>{room.location}</span>
            </div>
            <div className="flex items-center text-yellow-500 text-sm mb-3">
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              <span>{typeof room.rating === 'object' ? room.rating.average : room.rating} ({typeof room.rating === 'object' ? room.rating.count : room.ratingsCount} Ratings)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm mb-4">
              {room.amenities.wifi && (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faWifi} className="text-blue-600" />
                  <span>WiFi</span>
                </span>
              )}
              {room.amenities.tv && (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faTv} className="text-blue-600" />
                  <span>TV</span>
                </span>
              )}
              {room.amenities.elevator && (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faElevator} className="text-blue-600" />
                  <span>Elevator</span>
                </span>
              )}
              {room.amenities.bed && (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBed} className="text-blue-600" />
                  <span>{room.amenities.bed} Beds</span>
                </span>
              )}
              {room.amenities.bath && (
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBath} className="text-blue-600" />
                  <span>{room.amenities.bath} Baths</span>
                </span>
              )}
              {room.amenities.more && room.amenities.more.map((amenity, index) => (
                <span key={index} className="flex items-center gap-2">
                  <FontAwesomeIcon icon={getAmenityIcon(amenity)} className="text-blue-600" />
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            {room.price && room.price.amount > 0 ? (
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold text-gray-900">₹{room.price.amount}/{room.price.period}</span>
                {room.originalPrice > 0 && (
                  <span className="text-gray-500 line-through ml-2 text-base">₹{room.originalPrice}</span>
                )}
                {room.discountPercentage > 0 && (
                  <span className="text-green-600 text-sm ml-2">{room.discountPercentage}% off</span>
                )}
              </div>
            ) : (
              <p className="text-lg text-gray-600 mb-4">Price not available</p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDetails}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300 flex-grow sm:flex-grow-0"
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookNowClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex-grow sm:flex-grow-0"
              >
                Book Now
              </motion.button>
              {room.isOwner && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex-grow sm:flex-grow-0 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                  Delete
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Book {room.title}</h2>
              {!showPaymentForm ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => { setCheckInDate(date); setShowDateWarning(false); }}
                      selectsStart
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={new Date()}
                      placeholderText="Select Check-in Date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => { setCheckOutDate(date); setShowDateWarning(false); }}
                      selectsEnd
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={checkInDate || new Date()}
                      placeholderText="Select Check-out Date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {showDateWarning && (
                    <p className="text-red-500 text-sm mb-4">Please select both check-in and check-out dates.</p>
                  )}
                  <div className="text-xl font-bold text-gray-900 mb-4">
                    Total Price: ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })} INR
                  </div>
                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCloseBookingModal}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConfirmDates}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
                    >
                      Proceed to Payment
                    </motion.button>
                  </div>
                </>
              ) : (
                <PaymentForm
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  totalPrice={finalPrice}
                  onPaymentSuccess={handlePaymentSuccess}
                  onCancel={handleCloseBookingModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmationModal && bookingResult && (
          <BookingConfirmation
            bookingDetails={bookingResult}
            onClose={handleCloseBookingModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RoomCard;
