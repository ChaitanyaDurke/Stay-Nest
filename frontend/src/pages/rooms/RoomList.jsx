import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { allRoomsData } from '../../data/roomsData'; // Corrected import path - no longer needed
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
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/RoomList.css';
import api from '../../services/api'; // Using the api service
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';
import RoomCard from '../../components/RoomCard';

const RoomList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6); // Display 6 rooms per page
  const [totalRooms, setTotalRooms] = useState(0);

  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    sortBy: '-createdAt', // Default sort by newest
  });

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my-properties', 'favorites'
  
  // Toggle mobile filter panel
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
    document.body.style.overflow = !isMobileFilterOpen ? 'hidden' : '';
  };
  
  // Close mobile filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileFilterOpen && !event.target.closest('.filter-sidebar')) {
        toggleMobileFilter();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileFilterOpen]);
  const filterPanelRef = useRef(null);

  // New room state (for adding new property modal/form if implemented)
  const [newRoom, setNewRoom] = useState({
    title: '',
    location: '',
    description: '',
    price: '',
    roomType: '',
    bedrooms: '',
    bathrooms: '',
    amenities: {},
    maxGuests: '',
    availableFrom: '',
    availableTo: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);

  // Function to fetch rooms from the backend
  const getRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: roomsPerPage,
        ...filters,
        amenities: filters.amenities.join(','), // Convert array to comma-separated string
      };
      const response = await api.get('/properties', { params });
      setAllRooms(response.data.data);
      setTotalRooms(response.data.total); // Set total rooms for pagination
    } catch (err) {
      console.error('Error loading rooms:', err);
      setError(err.response?.data?.message || 'Failed to load rooms.');
      toast.error(err.response?.data?.message || 'Failed to load rooms.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch rooms when currentPage or filters change
  useEffect(() => {
    getRooms();
  }, [currentPage, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
        setIsFilterPanelOpen(false);
      }
    };

    if (isFilterPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterPanelOpen]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleAmenityChange = (amenity) => {
    setFilters((prevFilters) => {
      const updatedAmenities = prevFilters.amenities.includes(amenity)
        ? prevFilters.amenities.filter((a) => a !== amenity)
        : [...prevFilters.amenities, amenity];
      return { ...prevFilters, amenities: updatedAmenities };
    });
    setCurrentPage(1); // Reset to first page on amenity change
  };

  // Handle sort changes
  const handleSortChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: e.target.value,
    }));
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Date picker logic
  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleDayClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (!selectedDates.checkIn || (selectedDates.checkOut && selectedDates.checkIn && newDate < selectedDates.checkIn)) {
      setSelectedDates({ checkIn: newDate, checkOut: null });
    } else if (!selectedDates.checkOut || newDate > selectedDates.checkIn) {
      setSelectedDates((prev) => ({ ...prev, checkOut: newDate }));
    } else if (newDate.getTime() === selectedDates.checkIn.getTime()) {
      setSelectedDates({ checkIn: null, checkOut: null });
    } else {
      setSelectedDates((prev) => ({ ...prev, checkOut: null }));
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    if (currentMonth === 0) setCurrentYear((prevYear) => prevYear - 1);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    if (currentMonth === 11) setCurrentYear((prevYear) => prevYear + 1);
  };

  const renderCalendar = (month) => {
    const firstDayOfMonth = new Date(currentYear, month, 1).getDay();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, month, i);
      const isSelected = 
        (selectedDates.checkIn && date.toDateString() === selectedDates.checkIn.toDateString()) ||
        (selectedDates.checkOut && date.toDateString() === selectedDates.checkOut.toDateString()) ||
        (selectedDates.checkIn && selectedDates.checkOut && date > selectedDates.checkIn && date < selectedDates.checkOut);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={i}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  // Search input handling
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prevFilters) => ({
      ...prevFilters,
      location: searchTerm,
    }));
    setCurrentPage(1);
    // Optionally close filter panel on search
    setIsFilterPanelOpen(false);
  };

  const getMonthName = (date) => {
    return date.toLocaleString('en-US', { month: 'long' });
  };

  const formatDisplayDate = (date) => {
    return date ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Date';
  };

  const getDisplayDateRange = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      return `${formatDisplayDate(selectedDates.checkIn)} - ${formatDisplayDate(selectedDates.checkOut)}`;
    } else if (selectedDates.checkIn) {
      return `${formatDisplayDate(selectedDates.checkIn)} - Select Check-out`;
    } else {
      return 'Select Dates';
    }
  };

  const [guests, setGuests] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const getDisplayGuests = () => {
    return `${guests} Guest${guests > 1 ? 's' : ''}`;
  };

  const handleGuestDisplayClick = () => {
    setShowGuestDropdown(!showGuestDropdown);
  };

  const renderAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: faWifi,
      tv: faTv,
      elevator: faElevator,
      bed: faBed,
      bath: faBath,
      ac: faSnowflake,
      parking: faParking,
      kitchen: faUtensils,
      security: faFireExtinguisher,
      'work desk': faPlug,
      pool: faCheckCircle,
    };
    return iconMap[amenity.toLowerCase()] || faCheckCircle; // Default to faCheckCircle if not found
  };

  // Pagination Logic
  const totalPages = Math.ceil(totalRooms / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      sortBy: '-createdAt',
    });
    setSearchTerm('');
    setSelectedDates({ checkIn: null, checkOut: null });
    setGuests(1);
    setCurrentPage(1); // Reset page to 1
    setIsFilterPanelOpen(false); // Close filter panel
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        visiblePages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        visiblePages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return visiblePages;
  };

  // New Room Form State and Handlers (moved from Dashboard.jsx or similar)
  const handleNewRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      amenities: {
        ...prevRoom.amenities,
        [amenity]: !prevRoom.amenities[amenity],
      },
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmitNewRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in newRoom) {
        if (key === 'amenities') {
          // Append only true amenities
          const enabledAmenities = Object.keys(newRoom.amenities).filter(amp => newRoom.amenities[amp]);
          formData.append(key, JSON.stringify(enabledAmenities));
        } else if (newRoom[key] !== null && newRoom[key] !== undefined && newRoom[key] !== '') {
          formData.append(key, newRoom[key]);
        }
      }
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await api.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Property added successfully!');
      setIsNewRoomModalOpen(false);
      setNewRoom({
        title: '',
        location: '',
        description: '',
        price: '',
        roomType: '',
        bedrooms: '',
        bathrooms: '',
        amenities: {},
        maxGuests: '',
        availableFrom: '',
        availableTo: '',
      });
      setImageFile(null);
      getRooms(); // Refresh rooms list
    } catch (error) {
      console.error('Error adding new room:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add property.');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSuccess = () => {
    getRooms(); // Re-fetch rooms after a successful deletion
  };

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className={`filter-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
      <button className="close-filters-btn" onClick={toggleMobileFilter}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="filters-panel">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Location</label>
          <input 
            type="text" 
            name="location" 
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Search location"
          />
        </div>
        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-range">
            <input 
              type="number" 
              name="minPrice" 
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
            />
            <span>to</span>
            <input 
              type="number" 
              name="maxPrice" 
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </div>
        </div>
        <button 
          className="apply-filters-btn"
          onClick={() => {
            toggleMobileFilter();
            getRooms();
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  // Toggle mobile filter panel
  // const toggleMobileFilter = () => {
  //   setIsMobileFilterOpen(!isMobileFilterOpen);
  //   document.body.style.overflow = !isMobileFilterOpen ? 'hidden' : '';
  // };

  // Close mobile filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileFilterOpen && !event.target.closest('.filter-sidebar')) {
        toggleMobileFilter();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileFilterOpen]);

  // Filter sidebar component
  // const FilterSidebar = () => (
  //   <div className={`filter-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
  //     <button className="close-filters-btn" onClick={toggleMobileFilter}>
  //       <FontAwesomeIcon icon={faTimes} />
  //     </button>
  //     <div className="filters-panel">
  //       <h3>Filters</h3>
  //       <div className="filter-group">
  //         <label>Location</label>
  //         <input 
  //           type="text" 
  //           name="location" 
  //           value={filters.location}
  //           onChange={handleFilterChange}
  //           placeholder="Search location"
  //         />
  //       </div>
  //       <div className="filter-group">
  //         <label>Price Range</label>
  //         <div className="price-range">
  //           <input 
  //             type="number" 
  //             name="minPrice" 
  //             value={filters.minPrice}
  //             onChange={handleFilterChange}
  //             placeholder="Min"
  //           />
  //           <span>to</span>
  //           <input 
  //             type="number" 
  //             name="maxPrice" 
  //             value={filters.maxPrice}
  //             onChange={handleFilterChange}
  //             placeholder="Max"
  //           />
  //         </div>
  //       </div>
  //       <button 
  //         className="apply-filters-btn"
  //         onClick={() => {
  //           toggleMobileFilter();
  //           getRooms();
  //         }}
  //       >
  //         Apply Filters
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="room-list-container p-4 lg:p-8">
      {/* Mobile Filter Button */}
      <button 
        className="mobile-filter-button" 
        onClick={toggleMobileFilter}
        aria-label="Open filters"
      >
        <FontAwesomeIcon icon={faFilter} />
      </button>

      {/* Mobile Filter Overlay */}
      <div 
        className={`filter-overlay ${isMobileFilterOpen ? 'open' : ''}`} 
        onClick={toggleMobileFilter}
      />

      {/* Filter Sidebar */}
      <FilterSidebar />

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Rooms</h1>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="search-input-group relative flex-grow w-full md:w-auto">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 w-full md:w-auto"
        >
          Search
        </button>

        <div className="date-guests-filter flex-grow w-full md:w-auto">
          <div className="date-range-picker relative">
            <div
              className="date-display flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} // Toggle filter panel
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
              <span>{getDisplayDateRange()}</span>
              <FontAwesomeIcon icon={isFilterPanelOpen ? faChevronUp : faChevronDown} className="text-gray-400 ml-2" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300 w-full md:w-auto"
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" /> Filters
        </button>

        <button
          onClick={handleResetFilters}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 w-full md:w-auto"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" /> Reset
        </button>

        <button
          onClick={() => setIsNewRoomModalOpen(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 w-full md:w-auto"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Room
        </button>

      </div>

      {/* Filter Panel (Dropdown) */}
      {isFilterPanelOpen && (
        <div ref={filterPanelRef} className="filter-panel absolute right-4 md:right-8 bg-white p-6 rounded-lg shadow-xl z-10 border border-gray-200 w-full md:max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Advanced Filters</h3>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Price Range</label>
            <div className="flex gap-3">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                placeholder="Any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.bedrooms}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                placeholder="Any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.bathrooms}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[ 'wifi', 'tv', 'ac', 'kitchen', 'parking', 'elevator', 'pool', 'gym', 'security', 'work desk' ].map((amenity) => (
                <label key={amenity} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="ml-2 capitalize">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Sort By</label>
            <select
              name="sortBy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              <option value="-createdAt">Newest</option>
              <option value="price.amount">Price: Low to High</option>
              <option value="-price.amount">Price: High to Low</option>
              <option value="rating.average">Rating</option>
            </select>
          </div>

          {/* Dates Selection (Mini Calendar) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Check-in / Check-out Dates</label>
            <div className="calendar-container p-4 border border-gray-200 rounded-lg">
              <div className="calendar-header flex justify-between items-center mb-3">
                <button onClick={goToPreviousMonth} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"><FontAwesomeIcon icon={faChevronLeft} /></button>
                <span className="font-semibold text-gray-800">{getMonthName(new Date(currentYear, currentMonth))} {currentYear}</span>
                <button onClick={goToNextMonth} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"><FontAwesomeIcon icon={faChevronRight} /></button>
              </div>
              <div className="calendar-days-header grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              <div className="calendar-grid grid grid-cols-7 gap-1 text-sm">
                {renderCalendar(currentMonth)}
              </div>
            </div>
          </div>

          {/* Guests Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">Guests</label>
            <div
              className="guest-input flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white"
              onClick={handleGuestDisplayClick}
            >
              <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
              <span>{getDisplayGuests()}</span>
              <FontAwesomeIcon icon={showGuestDropdown ? faChevronUp : faChevronDown} className="text-gray-400 ml-2" />
            </div>
            {showGuestDropdown && (
              <div className="guest-dropdown absolute left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 p-3 z-20">
                <div className="flex items-center justify-between">
                  <button onClick={() => setGuests((prev) => Math.max(1, prev - 1))} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">-</button>
                  <span>{guests}</span>
                  <button onClick={() => setGuests((prev) => prev + 1)} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">+</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Room Listings */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots color="#1d4ed8" height={80} width={80} />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg mt-8">{error}</p>
      ) : allRooms.length > 0 ? (
        <div className="room-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {allRooms.map((room) => (
            <RoomCard key={room._id} room={room} designId={1} onDeleteSuccess={onDeleteSuccess} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-8">No rooms found matching your criteria.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-4 py-2 text-gray-700">...</span>
              ) : (
                <button
                  onClick={() => paginate(page)}
                  className={`px-4 py-2 border rounded-md ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* Add New Room Modal */}
      {isNewRoomModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Property</h2>
            <form onSubmit={handleSubmitNewRoom} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" value={newRoom.title} onChange={handleNewRoomChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" id="location" value={newRoom.location} onChange={handleNewRoomChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={newRoom.description} onChange={handleNewRoomChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (per month)</label>
                  <input type="number" name="price" id="price" value={newRoom.price} onChange={handleNewRoomChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">Room Type</label>
                  <select name="roomType" id="roomType" value={newRoom.roomType} onChange={handleNewRoomChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="">Select Type</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="Studio">Studio</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input type="number" name="bedrooms" id="bedrooms" value={newRoom.bedrooms} onChange={handleNewRoomChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input type="number" name="bathrooms" id="bathrooms" value={newRoom.bathrooms} onChange={handleNewRoomChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {[ 'wifi', 'tv', 'ac', 'kitchen', 'parking', 'elevator', 'pool', 'gym', 'security', 'work desk' ].map((amenity) => (
                    <label key={amenity} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-blue-600"
                        checked={!!newRoom.amenities[amenity]}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <span className="ml-2 capitalize">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">Max Guests</label>
                <input type="number" name="maxGuests" id="maxGuests" value={newRoom.maxGuests} onChange={handleNewRoomChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">Available From</label>
                  <input type="date" name="availableFrom" id="availableFrom" value={newRoom.availableFrom} onChange={handleNewRoomChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label htmlFor="availableTo" className="block text-sm font-medium text-gray-700">Available To</label>
                  <input type="date" name="availableTo" id="availableTo" value={newRoom.availableTo} onChange={handleNewRoomChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>
              <div>
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Property Image</label>
                <input type="file" name="imageFile" id="imageFile" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsNewRoomModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={loading}>Add Property</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;