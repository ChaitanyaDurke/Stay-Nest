import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faUser, faBuilding, faSpinner } from '@fortawesome/free-solid-svg-icons';

const RecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/bookings/recent`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch recent bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Recent Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No recent bookings found.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {booking.property.title}
                  </h2>
                  <p className="text-gray-600">
                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                    {booking.property.location}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  <span>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  <span>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  <span>Guests: {booking.guests}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ₹{booking.totalPrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentBookings; 