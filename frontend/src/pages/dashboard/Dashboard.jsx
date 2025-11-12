import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faList,
  faBuilding,
  faSignOutAlt,
  faCalendarAlt,
  faMapMarkerAlt,
  faDollarSign,
  faExclamationCircle,
  faHome,
  faChartLine,
  faCog,
  faBell,
  faHistory,
  faEnvelope,
  faPhone,
  faIdCard,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api'; // Import api service
import '../../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await api.get('/bookings/my-bookings');
        setBookings(response.data.data);
        setErrorBookings(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setErrorBookings('Failed to load bookings.');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []); // Run once on component mount

  const handleLogout = async () => {
    await logout();
    navigate('/profile');
  };

  const renderOverview = () => (
    <div className="dashboard-overview pt-8">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* User Information Section */}
      <div className="user-info-section bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{user?.name || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{user?.email || 'Not provided'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faPhone} className="text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-800">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faIdCard} className="text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            <FontAwesomeIcon icon={faList} className="text-blue-600" />
          </div>
          <div className="stat-content">
            <h3>{bookings.length}</h3>
            <p>Active Bookings</p>
            <span className="trend positive">+12% from last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            <FontAwesomeIcon icon={faBuilding} className="text-green-600" />
          </div>
          <div className="stat-content">
            <h3>{listings.length}</h3>
            <p>Active Listings</p>
            <span className="trend positive">+5% from last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600" />
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Upcoming Bookings</p>
            <span className="trend neutral">No change</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">
            <FontAwesomeIcon icon={faDollarSign} className="text-yellow-600" />
          </div>
          <div className="stat-content">
            <h3>₹0</h3>
            <p>Total Earnings</p>
            <span className="trend positive">+8% from last month</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="view-all">View All</button>
          </div>
          {loadingBookings ? (
            <p>Loading bookings...</p>
          ) : errorBookings ? (
            <p className="text-red-500">{errorBookings}</p>
          ) : bookings.length > 0 ? (
            <div className="activity-list">
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="activity-item">
                  <div className="activity-icon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className="activity-content">
                    <h4>{booking.property ? booking.property.title : 'N/A'}</h4>
                    <p>
                      <FontAwesomeIcon icon={faMapMarkerAlt} /> {booking.property ? booking.property.location : 'N/A'}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faCalendarAlt} /> 
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FontAwesomeIcon icon={faExclamationCircle} className="empty-icon" />
              <p>No recent activity</p>
              <button className="btn-primary" onClick={() => navigate('/rooms')}>
                Browse Rooms
              </button>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/rooms')}>
              <FontAwesomeIcon icon={faHome} />
              <span>Find Rooms</span>
            </button>
            <button className="action-card" onClick={() => navigate('/list-room')}>
              <FontAwesomeIcon icon={faBuilding} />
              <span>List Your Room</span>
            </button>
            <button className="action-card" onClick={() => navigate('/dashboard/profile')}>
              <FontAwesomeIcon icon={faUser} />
              <span>Edit Profile</span>
            </button>
            <button className="action-card" onClick={() => navigate('/dashboard/bookings')}>
              <FontAwesomeIcon icon={faHistory} />
              <span>My Bookings</span>
            </button>
            <button className="action-card" onClick={() => navigate('/dashboard/properties')}>
              <FontAwesomeIcon icon={faBuilding} />
              <span>My Properties</span>
            </button>
            <button className="action-card" onClick={() => navigate('/dashboard/settings')}>
              <FontAwesomeIcon icon={faCog} />
              <span>Settings</span>
            </button>
            <button className="action-card" onClick={() => navigate('/dashboard/notifications')}>
              <FontAwesomeIcon icon={faBell} />
              <span>Notifications</span>
            </button>
            <button className="action-card" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyBookings = () => (
    <div className="dashboard-bookings">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
      {loadingBookings ? (
        <p>Loading bookings...</p>
      ) : errorBookings ? (
        <p className="text-red-500">{errorBookings}</p>
      ) : bookings.length > 0 ? (
        <div className="booking-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card bg-white rounded-lg shadow-md p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={booking.property ? booking.property.title : 'N/A'}>
                  {booking.property ? booking.property.title : 'N/A'}
                </h3>
                <p className="text-gray-600 mb-1 text-sm"><strong>Booking ID:</strong> {booking._id.slice(-6).toUpperCase()}</p>
                <p className="text-gray-600 mb-1 text-sm"><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-1 text-sm"><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-4 text-sm"><strong>Total Price:</strong> ₹{booking.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                <p className="text-gray-600 mb-4 text-sm"><strong>Status:</strong> 
                  <span className={`status-badge ${booking.status.toLowerCase()} ml-2`}>
                    {booking.status}
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate(`/properties/${booking.property._id}`)}
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 self-start"
              >
                View Property
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faExclamationCircle} className="empty-icon" />
          <p>You have no bookings yet.</p>
          <button className="btn-primary" onClick={() => navigate('/rooms')}>
            Browse Rooms
          </button>
        </div>
      )}
    </div>
  );

  const renderMyProperties = () => (
    <div className="dashboard-my-properties">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Properties</h2>
      <p>Content for My Properties will go here.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="dashboard-settings">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      <p>Content for Settings will go here.</p>
    </div>
  );

  const renderNotifications = () => (
    <div className="dashboard-notifications">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <p>Content for Notifications will go here.</p>
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard-profile">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
      <p>Content for Profile will go here.</p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'bookings':
        return renderMyBookings();
      case 'properties':
        return renderMyProperties();
      case 'settings':
        return renderSettings();
      case 'notifications':
        return renderNotifications();
      case 'profile':
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Dashboard</h3>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                <FontAwesomeIcon icon={faChartLine} /> Overview
              </button>
            </li>
            <li>
              <button
                className={activeTab === 'bookings' ? 'active' : ''}
                onClick={() => setActiveTab('bookings')}
              >
                <FontAwesomeIcon icon={faHistory} /> My Bookings
              </button>
            </li>
            <li>
              <button
                className={activeTab === 'properties' ? 'active' : ''}
                onClick={() => setActiveTab('properties')}
              >
                <FontAwesomeIcon icon={faBuilding} /> My Properties
              </button>
            </li>
         
          
           
            
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Dashboard; 