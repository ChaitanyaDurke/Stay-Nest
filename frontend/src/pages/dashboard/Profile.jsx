import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCamera,
  faCheck,
  faExclamationCircle,
  faLock,
  faBell,
  faCreditCard,
  faShieldAlt,
  faBed,
  faHome,
  faCalendarAlt,
  faDollarSign,
  faEdit,
  faChevronRight,
  faCalendarCheck,
  faPlus,
  faStar,
  faHistory,
  faBuilding,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';
import RoomListingForm from '../../components/RoomListingForm';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [listedRooms, setListedRooms] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Fetch user's booked rooms
    const fetchBookedRooms = async () => {
      try {
        const response = await fetch('/api/bookings/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setBookedRooms(data);
      } catch (error) {
        console.error('Error fetching booked rooms:', error);
      }
    };

    // Fetch user's listed rooms
    const fetchListedRooms = async () => {
      try {
        const response = await fetch('/api/rooms/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setListedRooms(data);
      } catch (error) {
        console.error('Error fetching listed rooms:', error);
      }
    };

    // Load recent bookings from local storage
    const storedBookings = JSON.parse(localStorage.getItem('recentBookings')) || [];
    setRecentBookings(storedBookings);

    console.log('Loaded recent bookings from localStorage:', storedBookings);

    fetchBookedRooms();
    fetchListedRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (profileData.phone && !/^\+?[\d\s-]{10,}$/.test(profileData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        form: err.response?.data?.message || 'Failed to update profile'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <div className="profile-header glass-effect">
        <div className="profile-avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=16a085&color=fff&size=200`}
            alt="Profile"
            className="profile-avatar-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=User&background=16a085&color=fff&size=200`;
            }}
          />
          {isEditing && (
            <button className="avatar-edit pulse-effect">
              <FontAwesomeIcon icon={faCamera} />
            </button>
          )}
        </div>
        <div className="profile-info">
          <h2 className="gradient-text">{profileData.name || 'User'}</h2>
          <p className="text-muted">{profileData.email}</p>
          {profileData.location && (
            <p className="location">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {profileData.location}
            </p>
          )}
          {!isEditing && (
            <button 
              className="btn-edit-profile"
              onClick={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-stats glass-effect">
        <div className="stat-card hover-effect">
          <div className="stat-icon bg-blue-100">
            <FontAwesomeIcon icon={faBed} className="text-blue-600" />
          </div>
          <div className="stat-content">
            <h3>{bookedRooms.length}</h3>
            <p>Rooms Booked</p>
          </div>
        </div>
        <div className="stat-card hover-effect">
          <div className="stat-icon bg-green-100">
            <FontAwesomeIcon icon={faHome} className="text-green-600" />
          </div>
          <div className="stat-content">
            <h3>{listedRooms.length}</h3>
            <p>Rooms Listed</p>
          </div>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form glass-effect">
          {(errors.form) && (
            <div className="error-message slide-in">
              <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="form-grid">
            <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="name">Full Name</label>
              <div className="input-icon-group">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  required
                />
              </div>
              {errors.name && (
                <span className="error-text slide-in">{errors.name}</span>
              )}
            </div>

            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">Email</label>
              <div className="input-icon-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  required
                />
              </div>
              {errors.email && (
                <span className="error-text slide-in">{errors.email}</span>
              )}
            </div>

            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
              <label htmlFor="phone">Phone</label>
              <div className="input-icon-group">
                <FontAwesomeIcon icon={faPhone} className="input-icon" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
              </div>
              {errors.phone && (
                <span className="error-text slide-in">{errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <div className="input-icon-group">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={profileData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary hover-effect"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary hover-effect"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-group glass-effect">
            <h3>Personal Information</h3>
            <div className="detail-items">
              <div className="detail-item hover-effect">
                <FontAwesomeIcon icon={faUser} />
                <div>
                  <label>Full Name</label>
                  <p>{profileData.name}</p>
                </div>
              </div>
              <div className="detail-item hover-effect">
                <FontAwesomeIcon icon={faEnvelope} />
                <div>
                  <label>Email</label>
                  <p>{profileData.email}</p>
                </div>
              </div>
              {profileData.phone && (
                <div className="detail-item hover-effect">
                  <FontAwesomeIcon icon={faPhone} />
                  <div>
                    <label>Phone</label>
                    <p>{profileData.phone}</p>
                  </div>
                </div>
              )}
              {profileData.location && (
                <div className="detail-item hover-effect">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <div>
                    <label>Location</label>
                    <p>{profileData.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="detail-group glass-effect">
            <h3>Recent Bookings</h3>
            {bookedRooms.length > 0 ? (
              <div className="bookings-list">
                {bookedRooms.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="booking-item hover-effect">
                    <div className="booking-info">
                      <h4>{booking.roomName}</h4>
                      <p>
                        <FontAwesomeIcon icon={faCalendarAlt} /> {booking.startDate} - {booking.endDate}
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faDollarSign} /> {booking.price}
                      </p>
                    </div>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No bookings found</p>
            )}
          </div>

          <div className="detail-group glass-effect">
            <h3>Listed Rooms</h3>
            {listedRooms.length > 0 ? (
              <div className="listings-list">
                {listedRooms.slice(0, 3).map((room) => (
                  <div key={room.id} className="listing-item hover-effect">
                    <div className="listing-info">
                      <h4>{room.title}</h4>
                      <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {room.location}
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faDollarSign} /> {room.price}/night
                      </p>
                    </div>
                    <span className={`status-badge ${room.status.toLowerCase()}`}>
                      {room.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No rooms listed</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderRecentBookings = () => (
    <div className="profile-section">
      <h2 className="section-title">Recent Bookings</h2>
      {recentBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBookings.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <img src={room.image} alt={room.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{room.title}</h3>
                <p className="text-gray-600 text-sm mb-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />{room.location}</p>
                <div className="flex items-center text-yellow-500 text-sm mb-2">
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  <span>{room.rating} ({room.ratingsCount} Ratings)</span>
                </div>
                <p className="text-gray-800 font-semibold">₹{room.discountedPrice} <span className="text-sm text-gray-500 line-through">₹{room.originalPrice}</span></p>
                <p className="text-green-600 text-sm">{room.discountPercentage}% off</p>
                <div className="mt-4">
                  <button 
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 text-sm"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-4">No recent bookings yet. Start exploring rooms!</p>
      )}
    </div>
  );

  const renderSecurity = () => (
    <div className="profile-section">
      <h2>Security Settings</h2>
      <div className="security-options">
        <div className="security-card glass-effect hover-effect">
          <div className="security-icon">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <div className="security-content">
            <h3>Change Password</h3>
            <p>Update your password to keep your account secure</p>
          </div>
          <button className="btn-secondary">
            Change <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="security-card glass-effect hover-effect">
          <div className="security-icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="security-content">
            <h3>Notification Preferences</h3>
            <p>Manage your email and push notifications</p>
          </div>
          <button className="btn-secondary">
            Manage <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="security-card glass-effect hover-effect">
          <div className="security-icon">
            <FontAwesomeIcon icon={faShieldAlt} />
          </div>
          <div className="security-content">
            <h3>Two-Factor Authentication</h3>
            <p>Add an extra layer of security to your account</p>
          </div>
          <button className="btn-secondary">
            Enable <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="profile-section">
      <h2>Payment Methods</h2>
      <div className="payment-options">
        <div className="payment-card glass-effect hover-effect">
          <div className="payment-icon">
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <div className="payment-content">
            <h3>Add Payment Method</h3>
            <p>Add a new credit card or bank account</p>
          </div>
          <button className="btn-primary">
            Add New <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="payment-list glass-effect">
          <h3>Saved Payment Methods</h3>
          <div className="empty-state">
            <p>No payment methods added yet</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'bookings':
        return renderRecentBookings();
      case 'security':
        return renderSecurity();
      case 'payment':
        return renderPayment();
      case 'list-room':
        return <RoomListingForm />;
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar glass-effect">
        <div className="sidebar-header">
          <h2>Profile Settings</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''} hover-effect`}
            onClick={() => setActiveTab('personal')}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Personal Information</span>
            <FontAwesomeIcon icon={faChevronRight} className="nav-arrow" />
          </button>
          <button
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''} hover-effect`}
            onClick={() => setActiveTab('bookings')}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Recent Bookings</span>
            <FontAwesomeIcon icon={faChevronRight} className="nav-arrow" />
          </button>
          <button
            className={`nav-item ${activeTab === 'security' ? 'active' : ''} hover-effect`}
            onClick={() => setActiveTab('security')}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>Security</span>
            <FontAwesomeIcon icon={faChevronRight} className="nav-arrow" />
          </button>
          <button
            className={`nav-item ${activeTab === 'payment' ? 'active' : ''} hover-effect`}
            onClick={() => setActiveTab('payment')}
          >
            <FontAwesomeIcon icon={faCreditCard} />
            <span>Payment Methods</span>
            <FontAwesomeIcon icon={faChevronRight} className="nav-arrow" />
          </button>
          <button
            className={`nav-item ${activeTab === 'list-room' ? 'active' : ''} hover-effect`}
            onClick={() => setActiveTab('list-room')}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>List a Room</span>
            <FontAwesomeIcon icon={faChevronRight} className="nav-arrow" />
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile; 