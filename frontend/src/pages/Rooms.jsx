import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faMapMarkerAlt,
  faStar,
  faBed,
  faBath,
  faRuler,
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp,
  faUsers,
  faWifi,
  faTv,
  faParking,
  faUtensils,
  faSnowflake,
  faFireExtinguisher,
  faPlug,
  faCheckCircle,
  faCalendarAlt,
  faHeart,
  faShare,
  faMap,
  faSliders,
  faSort,
  faChevronRight,
  faLocationDot,
  faCalendar,
  faUser,
  faDoorOpen,
  faChevronLeft,
  faElevator,
  faTint,
  faDumbbell
} from '@fortawesome/free-solid-svg-icons';
import '../styles/RoomList.css';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const locationHook = useLocation();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [filters, setFilters] = useState({
    location: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    minPrice: 0,
    maxPrice: 50000,
    roomType: '',
    amenities: {
      wifi: false,
      ac: false,
      tv: false,
      parking: false,
      kitchen: false
    }
  });

  const [sortBy, setSortBy] = useState('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  useEffect(() => {
    const queryParams = new URLSearchParams(locationHook.search);
    const initialFilters = {};

    if (queryParams.get('location')) {
      initialFilters.location = queryParams.get('location');
    }
    if (queryParams.get('roomType')) {
      initialFilters.roomType = queryParams.get('roomType');
    }
    if (queryParams.get('minPrice')) {
      initialFilters.minPrice = Number(queryParams.get('minPrice'));
    }
    if (queryParams.get('maxPrice')) {
      initialFilters.maxPrice = Number(queryParams.get('maxPrice'));
    }

    // Parse amenities from query params
    const amenitiesFromQuery = queryParams.get('amenities');
    if (amenitiesFromQuery) {
      amenitiesFromQuery.split(',').forEach(amenity => {
        if (initialFilters.amenities) {
          initialFilters.amenities[amenity] = true;
        } else {
          initialFilters.amenities = { [amenity]: true };
        }
      });
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      ...initialFilters
    }));
  }, [locationHook.search]);

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);
      try {
        console.log("Current Filters:", filters);
        
        const params = {
          location: filters.location,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.specifications?.bedrooms, // Assuming specifications are flat in filters for now
          bathrooms: filters.specifications?.bathrooms,
          amenities: Object.keys(filters.amenities).filter(key => filters.amenities[key]).join(','),
          sortBy: sortBy,
          page: currentPage,
          limit: roomsPerPage
        };

        // Remove undefined or null parameters
        Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null || params[key] === '') && delete params[key]);

        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/properties`, { params });
        const fetchedRooms = response.data.data;
        const totalItems = response.data.total;

        setRooms(fetchedRooms);
        // setCurrentPage(response.data.page); // Assuming backend returns current page
        // setTotalPages(Math.ceil(totalItems / roomsPerPage)); // Assuming backend returns total items

      } catch (error) {
        console.error('Error loading rooms:', error);
        setError(error.response?.data?.message || 'Error loading rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [filters, sortBy, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [name]: checked
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      checkIn: null,
      checkOut: null,
      guests: 1,
      minPrice: 0,
      maxPrice: 50000,
      roomType: '',
      amenities: {
        wifi: false,
        ac: false,
        tv: false,
        parking: false,
        kitchen: false
      }
    });
    setSortBy('price-asc');
    setCurrentPage(1);
  };

  // Pagination logic remains mostly the same, but totalPages will now be calculated based on backend total
  const totalPages = Math.ceil(rooms.length / roomsPerPage); // This will need to change if backend provides total count
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom); // This slicing will be less relevant if backend handles pagination

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="room-list-page p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pt-8">Available Rooms</h1>

        {/* Filters and Search Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md lg:block sticky top-4 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
              Filters <FontAwesomeIcon icon={faFilter} className="text-blue-600" />
            </h2>

            {/* Room Type Filter */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Room Type</label>
              <select
                name="roomType"
                value={filters.roomType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">All Types</option>
                <option value="Studio">Studio</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
              <div className="relative">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., Downtown, City Center"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Price Range</label>
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">₹</span>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
                <span className="text-gray-600">-</span>
                <span className="text-gray-600">₹</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-gray-700 text-sm font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {Object.keys(filters.amenities).map(amenity => (
                  <label key={amenity} className="flex items-center text-gray-700 text-sm cursor-pointer hover:text-blue-600 transition duration-200">
                    <input
                      type="checkbox"
                      name={amenity}
                      checked={filters.amenities[amenity]}
                      onChange={() => handleAmenityChange(amenity)}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 capitalize">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Guests Filter */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <label htmlFor="guests" className="block text-gray-700 text-sm font-semibold mb-2">Guests</label>
              <div className="relative">
                <FontAwesomeIcon icon={faUsers} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  placeholder="Number of guests"
                  min="1"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={filters.guests}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
              onClick={() => { /* Apply filters logic is now handled by useEffect */ }}
            >
              Apply Filters
            </button>
            <button
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300 font-semibold mt-3"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </aside>

          {/* Right Content - Room Listings */}
          <div className="lg:w-3/4">
            {/* Sort By and Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md mb-6 sticky top-4 z-10">
              <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={filters.location}
                  name="location"
                  onChange={handleFilterChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="sortBy" className="sr-only">Sort By</label>
                <select
                  id="sortBy"
                  name="sortBy"
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                </select>
              </div>
            </div>

            {loading && <p className="text-center text-gray-700">Loading rooms...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!loading && rooms.length === 0 && <p className="text-center text-gray-700">No rooms found matching your criteria.</p>}

            <div className="grid grid-cols-1 gap-6">
              {currentRooms.map((room) => (
                <RoomCard key={room.id} room={room} designId={5} />
              ))}
            </div>

            {/* Pagination */}
            <nav className="flex justify-center mt-8">
              <ul className="flex items-center space-x-2">
                <li>
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index + 1}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-2 leading-tight ${currentPage === index + 1 ? 'text-gray-700 bg-blue-100 border border-blue-300' : 'text-gray-500 bg-white border border-gray-300'} rounded-lg hover:bg-gray-100 hover:text-gray-700`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms; 