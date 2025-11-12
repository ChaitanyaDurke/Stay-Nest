import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faDollarSign, 
  faTimes,
  faExclamationCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const RecentBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingTitle, setSelectedBookingTitle] = useState('');

  useEffect(() => {
    // Load bookings from localStorage
    const loadBookings = () => {
      const storedBookings = JSON.parse(localStorage.getItem('recentBookings') || '[]');
      setBookings(storedBookings);
    };

    loadBookings();
    // Add event listener for storage changes
    window.addEventListener('storage', loadBookings);
    return () => window.removeEventListener('storage', loadBookings);
  }, []);

  const handleCancelBooking = (bookingId, bookingTitle) => {
    setSelectedBookingId(bookingId);
    setSelectedBookingTitle(bookingTitle);
    setShowCancelConfirm(true);
  };

  const confirmCancelBooking = () => {
    if (selectedBookingId) {
      const updatedBookings = bookings.filter(booking => booking.id !== selectedBookingId);
      localStorage.setItem('recentBookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
      setShowCancelConfirm(false);
      setSelectedBookingId(null);
      setSelectedBookingTitle('');
    }
  };

  return (
    <div className="recent-bookings p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Recent Bookings</h2>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="relative">
                <img 
                  src={booking.image} 
                  alt={booking.title} 
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{booking.title}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    {booking.location}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                    ${booking.price} per night
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Added on {new Date(booking.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancelBooking(booking.id, booking.title)}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600 text-lg">No recent bookings found</p>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Cancel Booking</h3>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Are you sure you want to cancel your booking for:</p>
              <p className="font-semibold text-gray-800">{selectedBookingTitle}</p>
              <p className="text-gray-600 mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentBooking;
