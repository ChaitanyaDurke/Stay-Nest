import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { allRoomsData } from '../data/roomsData'; // Import allRoomsData
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, faWifi, faTv, faElevator, faBed, faBath, 
  faUtensils, faParking, faSnowflake, faSwimmingPool,
  faDumbbell, faShieldAlt, faCalendarAlt, faMapMarkerAlt, faArrowLeft,
  faImages, faBuilding, faHeart, faPen, faTag, faCheckCircle,
  faShare, faLocationDot, faUser, faDoorOpen, faRuler, faFireExtinguisher
} from '@fortawesome/free-solid-svg-icons';
import Toast from './Toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PaymentForm from './PaymentForm'; // Import PaymentForm
import api from '../services/api'; // Import the API service

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation hook
  const [room, setRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSubMessage, setToastSubMessage] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [roomsCount, setRoomsCount] = useState(1);
  const [roomsGuestCounts, setRoomsGuestCounts] = useState({ 1: 1 }); // Stores guests for each room
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('WELCOME80'); // Default coupon
  const [couponSaving, setCouponSaving] = useState(0);
  const [showDateWarning, setShowDateWarning] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false); // New state for payment form

  useEffect(() => {
    console.log('RoomDetails - ID from URL:', id); // Debug log
    
    // Try to get room data from navigation state first
    const roomDataFromState = location.state?.roomData;

    let foundRoom = null;
    if (roomDataFromState && roomDataFromState.id === parseInt(id)) {
      foundRoom = roomDataFromState;
    } else {
      // Fallback to searching allRoomsData if not found in state or ID mismatch
      foundRoom = allRoomsData.find(r => r.id === parseInt(id));
    }

    console.log('RoomDetails - Found Room:', foundRoom); // Debug log
    if (foundRoom) {
      // Convert single image to array if needed
      const roomWithImages = {
        ...foundRoom,
        images: foundRoom.images || [foundRoom.image] // Ensure images is an array
      };
      setRoom(roomWithImages);
    } else {
      // Optionally handle case where room is not found, e.g., redirect to a 404 page
      console.warn(`Room with ID ${id} not found.`);
      // navigate('/404'); // Example redirect
    }

    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, location.state]); // Add location.state to dependency array

  useEffect(() => {
    if (room && checkInDate && checkOutDate) {
      const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      let calculatedSaving = 0;
      if (couponApplied) {
        // Example: 80% off on base price for WELCOME80
        calculatedSaving = (room.discountedPrice * 0.8) * days * roomsCount;
      }
      setCouponSaving(calculatedSaving);
    }
  }, [room, checkInDate, checkOutDate, couponApplied, roomsCount]);

  const handleAddToBookings = () => {
    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('recentBookings') || '[]');
    
    // Check if room is already in bookings
    const isAlreadyBooked = existingBookings.some(booking => booking.id === room.id);
    
    if (!isAlreadyBooked) {
      // Add new booking
      const updatedBookings = [...existingBookings, {
        id: room.id,
        title: room.title,
        image: room.images[0],
        price: room.discountedPrice,
        location: room.location,
        addedAt: new Date().toISOString()
      }];
      
      // Save to localStorage
      localStorage.setItem('recentBookings', JSON.stringify(updatedBookings));
      
      // Show success toast
      setToastMessage('Successfully saved!');
      setToastSubMessage('Room has been added to your recent bookings.');
      setShowToast(true);
    } else {
      // Show already booked toast
      setToastMessage('Already in bookings');
      setToastSubMessage('This room is already in your recent bookings.');
      setShowToast(true);
    }
  };

  const handleBookNow = () => {
    console.log('handleBookNow called.');
    console.log('Check-in Date:', checkInDate);
    console.log('Check-out Date:', checkOutDate);
    if (!checkInDate || !checkOutDate) {
      setShowDateWarning(true);
      setToastMessage('Dates Required!');
      setToastSubMessage('Please select both check-in and check-out dates.');
      setShowToast(true);
      return;
    }

    setShowPaymentForm(true); // Show the payment form
  };

  const handlePaymentSuccess = async () => {
    console.log('handlePaymentSuccess called.');
    console.log('Room ID:', room._id);
    console.log('Check-in Date (before API):', checkInDate);
    console.log('Check-out Date (before API):', checkOutDate);
    console.log('Total Price (before API):', finalPrice);
    try {
      const bookingData = {
        propertyId: room._id, // Assuming room._id is the MongoDB _id
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: Object.values(roomsGuestCounts).reduce((acc, count) => acc + count, 0), // Sum of guests from all rooms
        totalPrice: finalPrice,
      };

      await api.post('/bookings', bookingData);

      setShowPaymentForm(false);
      setToastMessage('Booking successful!');
      setToastSubMessage('Your room has been booked successfully.');
      setShowToast(true);
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      setShowPaymentForm(false);
      setToastMessage('Booking failed!');
      setToastSubMessage(error.response?.data?.message || 'An error occurred during booking. Please try again.');
      setShowToast(true);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setToastMessage('Booking cancelled.');
    setToastSubMessage('You have cancelled the booking process.');
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleGuestChange = (type) => {
    if (type === 'increase') {
      setGuests(prev => prev + 1);
    } else if (type === 'decrease' && guests > 1) {
      setGuests(prev => prev - 1);
    }
  };

  const handleRoomGuestChange = (roomIndex, type) => {
    setRoomsGuestCounts(prevCounts => {
      const newCounts = { ...prevCounts };
      if (type === 'increase') {
        newCounts[roomIndex] = (newCounts[roomIndex] || 0) + 1;
      } else if (type === 'decrease' && newCounts[roomIndex] > 1) {
        newCounts[roomIndex] = newCounts[roomIndex] - 1;
      }
      return newCounts;
    });
  };

  const handleAddRoom = () => {
    setRoomsCount(prev => prev + 1);
    setRoomsGuestCounts(prevCounts => ({ ...prevCounts, [roomsCount + 1]: 1 }));
  };

  const handleDeleteRoom = (roomIndex) => {
    if (roomsCount > 1) {
      setRoomsCount(prev => prev - 1);
      setRoomsGuestCounts(prevCounts => {
        const newCounts = { ...prevCounts };
        delete newCounts[roomIndex];
        return newCounts;
      });
    }
  };

  if (!room) {
    return <div className="text-center text-gray-600 py-8">Room not found.</div>;
  }

  const amenities = [
    { icon: faWifi, label: 'Free WiFi', available: room.amenities.wifi },
    { icon: faTv, label: 'Smart TV', available: room.amenities.tv },
    { icon: faElevator, label: 'Elevator', available: room.amenities.elevator },
    { icon: faBed, label: `${room.amenities.bed} Beds`, available: true },
    { icon: faBath, label: `${room.amenities.bath} Baths`, available: true },
    { icon: faUtensils, label: 'Kitchen', available: room.amenities.kitchen },
    { icon: faParking, label: 'Parking', available: room.amenities.parking },
    { icon: faSnowflake, label: 'AC', available: room.amenities.ac },
    { icon: faSwimmingPool, label: 'Pool', available: room.amenities.pool },
    { icon: faDumbbell, label: 'Gym', available: room.amenities.gym },
    { icon: faShieldAlt, label: 'Security', available: room.amenities.security },
  ];

  const days = (checkInDate && checkOutDate) ? (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24) : 0;
  const basePricePerNight = room.discountedPrice;
  const totalBasePrice = basePricePerNight * days * roomsCount;
  const taxesAndFees = totalBasePrice * 0.18; // 18% tax example
  const finalPrice = totalBasePrice + taxesAndFees - couponSaving;
  const totalSavings = (room.originalPrice * days * roomsCount - totalBasePrice) + couponSaving;

  return (
    <div className="min-h-screen bg-gray-50 pt-90">
      {showToast && (
        <Toast
          message={toastMessage}
          subMessage={toastSubMessage}
          onClose={handleCloseToast}
        />
      )}

      {/* Hero Section */}
      <div className="relative">
        <div className="h-[60vh] relative">
          <img
            src={room.images[selectedImage]}
            alt={room.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex items-center text-white hover:text-gray-200 transition duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Rooms
          </button>

          {/* Image Gallery Thumbnails */}
          {room.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {room.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${room.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl p-6 mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Room Details */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                    <span>{room.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {room.rating} <FontAwesomeIcon icon={faStar} className="ml-1" />
                    </div>
                    <span className="text-gray-600">{room.ratingsCount} Ratings</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">Company-Serviced</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Room Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <FontAwesomeIcon icon={faBed} className="w-5 h-5 text-sky-600" />
                  <span>{room.amenities.bed} Beds</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FontAwesomeIcon icon={faBath} className="w-5 h-5 text-sky-600" />
                  <span>{room.amenities.bath} Baths</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FontAwesomeIcon icon={faRuler} className="w-5 h-5 text-sky-600" />
                  <span>{room.area} sq.ft</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-sky-600" />
                  <span>Up to {room.maxGuests || room.amenities.bed * 2} guests</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this place</h2>
                <p className="text-gray-600 leading-relaxed">{room.description || 'A comfortable and well-maintained space for your stay.'}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className={`flex items-center gap-2 ${amenity.available ? 'text-gray-700' : 'text-gray-400'}`}>
                      <FontAwesomeIcon icon={amenity.icon} className={`w-5 h-5 ${amenity.available ? 'text-sky-600' : 'text-gray-400'}`} />
                      <span className={amenity.available ? '' : 'line-through'}>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                <img
                  src={room.locationImage || 'https://via.placeholder.com/800x450'}
                  alt="Location Map"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-600">{room.locationDescription || `Located in ${room.location}, this property offers easy access to local amenities and attractions.`}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">{room.rating}</span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={`w-4 h-4 ${i < Math.floor(room.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{room.ratingsCount} verified reviews</p>
              {/* Add review cards here */}
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:w-1/3">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-blue-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Booking Details</h2>
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-6">
                {/* Total Price */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Price</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    17,226.82 INR
                  </div>
                  <div className="text-sm text-green-600">
                    Free cancellation 1 day prior to stay
                  </div>
                </div>

                {/* Dates & Time */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Dates & Time</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DatePicker
                        selected={checkInDate}
                        onChange={(date) => setCheckInDate(date)}
                        selectsStart
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        placeholderText="Check-in"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                    <div className="relative">
                      <DatePicker
                        selected={checkOutDate}
                        onChange={(date) => setCheckOutDate(date)}
                        selectsEnd
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        minDate={checkInDate}
                        placeholderText="Check-out"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Reservation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Reservation</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        value={1}
                        onChange={() => {}}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value={1}>1 room</option>
                        <option value={2}>2 rooms</option>
                        <option value={3}>3 rooms</option>
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                    
                    <div className="relative">
                      <select
                        value={2}
                        onChange={() => {}}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value={1}>1 guest</option>
                        <option value={2}>2 guests</option>
                        <option value={3}>3 guests</option>
                        <option value={4}>4 guests</option>
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Room Type</h3>
                  <div className="relative">
                    <select
                      value="1 King Bed Standard Non Smoking"
                      onChange={() => {}}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="1 King Bed Standard Non Smoking">1 King Bed Standard Non Smoking</option>
                      <option value="1 Queen Bed Standard Non Smoking">1 Queen Bed Standard Non Smoking</option>
                      <option value="2 Twin Beds Standard Non Smoking">2 Twin Beds Standard Non Smoking</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Per day rate */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Per day rate</h3>
                  <div className="text-lg text-gray-700">
                    14,599 INR
                  </div>
                </div>

                {/* Taxes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Taxes</h3>
                  <div className="text-lg text-gray-700 mb-2">
                    2,627.82 INR
                  </div>
                  <div className="text-sm text-gray-500">
                    GST: 12% on INR 0 - 2,500, 12% on INR 2,500-7,500, 18% on INR 7,500 and above
                  </div>
                </div>

                {/* Confirm Button */}
                <button 
                  onClick={handleBookNow}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Additional Booking Info */}
            {/* <p className="text-red-500 text-sm font-semibold mb-2">
              <FontAwesomeIcon icon={faFireExtinguisher} className="mr-2" />8 people booked this hotel today
            </p> */}
            {/* <p className="text-gray-700 text-sm font-semibold mb-2">
              Cancellation Policy <FontAwesomeIcon icon={faTag} />
            </p> */}
            <p className="text-gray-600 text-sm mb-4">Follow safety measures advised at the hotel</p>
            <p className="text-gray-600 text-sm">
              By proceeding, you agree to our <span className="text-sky-600 font-semibold cursor-pointer">Guest Policies.</span>
            </p>
          </div>
        </div>
      </div>
      
      {showPaymentForm && checkInDate && checkOutDate && (
        <PaymentForm
          startDate={checkInDate}
          endDate={checkOutDate}
          totalPrice={finalPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
};

export default RoomDetails; 