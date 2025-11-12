import React, { useState, useEffect } from 'react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // API call to get user's bookings
        // const response = await fetch('/api/bookings/my-bookings');
        // const data = await response.json();
        // setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{booking.property.title}</h2>
                <p className="text-gray-600 mb-4">{booking.property.location}</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Check-in:</span>{' '}
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Check-out:</span>{' '}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Price:</span>{' '}
                    ${booking.totalPrice}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings; 