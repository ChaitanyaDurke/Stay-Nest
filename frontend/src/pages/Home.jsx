import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faMapMarkerAlt,
  faStar,
  faHome,
  faShieldAlt,
  faCalendarCheck,
  faBed,
  faBath,
  faRuler,
  faChevronRight,
  faCheckCircle,
  faUser,
  faBuilding,
  faGlobe,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import Hero from '../components/Hero';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const featuredRooms = [
    {
      id: 1,
      title: "Luxury Apartment",
      location: "Downtown",
      price: 150,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      beds: 2,
      baths: 2,
      area: 1200
    },
    {
      id: 2,
      title: "Cozy Studio",
      location: "Westside",
      price: 80,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      beds: 1,
      baths: 1,
      area: 600
    },
    {
      id: 3,
      title: "Modern Loft",
      location: "Eastside",
      price: 120,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      beds: 3,
      baths: 2,
      area: 1500
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "Student",
      text: "Found the perfect room for my studies. The process was smooth and the room was exactly as described.",
      image: "https://ui-avatars.com/api/?name=John+Doe&background=random"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Professional",
      text: "Great experience with RoomRent. The platform made it easy to find a room that matched my requirements.",
      image: "https://ui-avatars.com/api/?name=Jane+Smith&background=random"
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Traveler",
      text: "Perfect for short-term stays. The booking process was quick and the room was clean and comfortable.",
      image: "https://ui-avatars.com/api/?name=Mike+Johnson&background=random"
    }
  ];

  const handleViewAll = () => {
    navigate('/rooms');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Rooms Section */}
      <section className="py-20 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sky-900 mb-4">Featured Rooms</h2>
            <p className="text-xl text-sky-700 max-w-2xl mx-auto">
              Discover our most popular rooms and apartments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                    src={room.image} 
                    alt={room.title} 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-sky-800 shadow-md">
                    <div className="text-lg font-semibold text-sky-900">
                      ₹{room.price}/night
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-amber-600">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <span>{room.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-sky-900 mb-2">{room.title}</h3>
                  <div className="flex items-center text-sky-700 mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    <span>{room.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-sky-700">
                      <FontAwesomeIcon icon={faBed} className="mr-2" />
                      <span>{room.beds} Beds</span>
                    </div>
                    <div className="flex items-center text-sky-700">
                      <FontAwesomeIcon icon={faBath} className="mr-2" />
                      <span>{room.baths} Baths</span>
                    </div>
                    <div className="flex items-center text-sky-700">
                      <FontAwesomeIcon icon={faRuler} className="mr-2" />
                      <span>{room.area} sq.ft</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/rooms')}
                    className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button 
              onClick={handleViewAll}
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-base font-medium rounded-lg text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              View All Rooms
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sky-900 mb-4">Our Services</h2>
            <p className="text-xl text-sky-700 max-w-2xl mx-auto">
              Experience the best in room rental services with our comprehensive offerings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faSearch} className="text-2xl text-sky-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 mb-4">Smart Search</h3>
              <p className="text-sky-700 leading-relaxed">
                Find your perfect room with our advanced search filters and real-time availability updates
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faShieldAlt} className="text-2xl text-sky-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 mb-4">Verified Listings</h3>
              <p className="text-sky-700 leading-relaxed">
                Every listing is thoroughly verified to ensure your safety and satisfaction
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl text-sky-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 mb-4">Easy Booking</h3>
              <p className="text-sky-700 leading-relaxed">
                Book your room instantly with our secure and hassle-free booking system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{testimonial.text}</p>
                <div className="mt-4 flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#6FE6FC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Perfect Room?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who found their ideal accommodation through StayNest
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Get Started
            </Link>
            <Link 
              to="/rooms" 
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 