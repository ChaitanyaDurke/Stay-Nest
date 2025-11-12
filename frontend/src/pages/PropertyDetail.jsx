import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBed,
  faBath,
  faRuler,
  faWifi,
  faTv,
  faParking,
  faUtensils,
  faSnowflake,
  faElevator,
  faShieldAlt,
  faSwimmingPool,
  faDumbbell,
  faHeart,
  faCalendarAlt,
  faUser,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';

const amenitiesList = [
  { key: 'wifi', label: 'WiFi', icon: faWifi },
  { key: 'tv', label: 'TV', icon: faTv },
  { key: 'parking', label: 'Parking', icon: faParking },
  { key: 'kitchen', label: 'Kitchen', icon: faUtensils },
  { key: 'ac', label: 'AC', icon: faSnowflake },
  { key: 'elevator', label: 'Elevator', icon: faElevator },
  { key: 'security', label: 'Security', icon: faShieldAlt },
  { key: 'pool', label: 'Pool', icon: faSwimmingPool },
  { key: 'gym', label: 'Gym', icon: faDumbbell },
];

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'amenities', label: 'Amenities' },
  { key: 'reviews', label: 'Reviews' },
];

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/properties/${id}`);
      setProperty(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching property details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/bookings', {
        propertyId: id,
        ...bookingData
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        alert('Booking request sent successfully!');
        navigate('/my-bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating booking');
    }
  };

  const toggleFavorite = async () => {
    try {
      await axios.patch(`/api/properties/${id}/favorite`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchProperty(); // Refresh property data
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
          <span className="text-lg text-purple-700 font-semibold">Loading property details...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-purple-50">
        <div className="bg-white border border-red-300 text-red-700 px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center">
          <span className="block text-xl font-bold mb-2">Oops!</span>
          <span className="block text-base">{error}</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-0 pb-12">
      {/* Hero Section */}
      <div className="relative w-full h-[340px] md:h-[420px] flex items-end">
        <img
          src={property.images[0]?.url}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover rounded-b-3xl shadow-xl border-b-4 border-purple-200"
        />
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center md:items-end justify-between px-8 py-6 bg-gradient-to-t from-white/90 via-white/60 to-transparent rounded-b-3xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow-lg">{property.title}</h1>
            <p className="text-blue-600 text-lg font-medium flex items-center gap-2 drop-shadow">
              <FontAwesomeIcon icon={faRuler} className="text-purple-400" />
              {property.location}
            </p>
          </div>
          <button
            onClick={toggleFavorite}
            className="p-4 bg-white rounded-full shadow-lg hover:bg-pink-50 border border-pink-200 transition-colors ml-0 md:ml-8 mt-4 md:mt-0"
            title="Add to favorites"
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={`text-3xl ${property.favorites?.includes(localStorage.getItem('userId')) ? 'text-pink-500' : 'text-blue-300'}`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-10 flex flex-col lg:flex-row gap-10">
        {/* Left: Gallery & Tabs */}
        <div className="flex-1 min-w-0">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="flex md:hidden overflow-x-auto gap-4 pb-2">
              {property.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={`${property.title} - Image ${idx + 1}`}
                  className="w-64 h-40 object-cover rounded-xl border border-blue-100 shadow-sm flex-shrink-0"
                />
              ))}
            </div>
            <div className="hidden md:grid grid-cols-2 gap-6">
              {property.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={`${property.title} - Image ${idx + 1}`}
                  className="w-full h-56 object-cover rounded-xl border border-blue-100 shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-4 border-b border-purple-200 mb-4">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors focus:outline-none ${activeTab === tab.key ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow' : 'text-purple-700 hover:bg-purple-100'}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 min-h-[180px]">
              {activeTab === 'description' && (
                <>
                  <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBed} className="text-purple-400" /> Description
                  </h2>
                  <p className="text-gray-700 text-lg mb-6">{property.description}</p>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <FontAwesomeIcon icon={faBed} className="text-purple-500" />
                      <span className="font-medium">{property.specifications.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <FontAwesomeIcon icon={faBath} className="text-purple-500" />
                      <span className="font-medium">{property.specifications.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <FontAwesomeIcon icon={faRuler} className="text-purple-500" />
                      <span className="font-medium">{property.specifications.area} sq.ft</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <FontAwesomeIcon icon={faUser} className="text-purple-500" />
                      <span className="font-medium">{property.specifications.furnishing}</span>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'amenities' && (
                <>
                  <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-purple-400" /> Amenities
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {amenitiesList.map(amenity => (
                      property.amenities[amenity.key] && (
                        <span
                          key={amenity.key}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-blue-800 rounded-full shadow border border-purple-200 text-base font-medium"
                        >
                          <FontAwesomeIcon icon={amenity.icon} className="text-purple-500" />
                          {amenity.label}
                        </span>
                      )
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'reviews' && (
                <div className="text-gray-500 italic">Reviews feature coming soon!</div>
              )}
            </div>
          </div>

          {/* Go Back Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.history.back()}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all text-xl font-bold tracking-wide"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Right: Sticky Booking Card */}
        {/* <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="lg:sticky lg:top-32">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 mb-8 flex flex-col items-center">
              <div className="text-4xl font-extrabold text-purple-700 mb-2 tracking-tight">
                ₹{property.price.amount.toLocaleString()}
                <span className="text-blue-400 text-2xl font-normal">/month</span>
              </div>
              <div className="text-base text-blue-500 mb-4">
                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                {property.price.currency} • {property.price.period}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PropertyDetail; 