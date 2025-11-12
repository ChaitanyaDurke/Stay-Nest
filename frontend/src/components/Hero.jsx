import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [location, setLocation] = useState('');
  const [roomType, setRoomType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (roomType) params.append('roomType', roomType);
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (!isNaN(min)) params.append('minPrice', min);
      if (!isNaN(max)) params.append('maxPrice', max);
    }
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1473893604213-3df9c15611c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJvb218ZW58MHx8MHx8fDA%3D')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Get the app section */}
      

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Find amazing hotels, compare prices, and
          <br />
          book your dream vacation easily
        </h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl">
          Search trusted hotels for unforgettable stays and hassle-free bookings. Find the best
          hotels near you in seconds with ease and confidence!
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-4xl flex flex-col lg:flex-row items-end space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Location */}
          <div className="flex-1 w-full">
            <label htmlFor="location" className="block text-gray-700 text-sm font-semibold">Location</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                id="location"
                placeholder="Lisbon, Portugal"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex-1 w-full">
            <label htmlFor="type" className="block text-gray-700 text-sm font-semibold">Type</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <select
                id="type"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900 appearance-none"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="Studio">Studio</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex-1 w-full">
            <label htmlFor="price" className="block text-gray-700 text-sm font-semibold">Price</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l-3 3v-3H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v3m-2 10h.01M17 12H7" />
              </svg>
              <select
                id="price"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-900 appearance-none"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="0-5000">₹0 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-15000">₹10,000 - ₹15,000</option>
                <option value="15000-20000">₹15,000 - ₹20,000</option>
                <option value="20000-">₹20,000+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full lg:w-auto px-8 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105 h-full flex-shrink-0"
          >
            Search Hotel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero; 