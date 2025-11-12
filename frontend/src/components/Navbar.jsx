import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faDoorOpen, 
  faHome, 
  faSignOutAlt, 
  faUser, 
  faSignInAlt, 
  faUserPlus,
  faBars,
  faTimes,
  faBell,
  faCog,
  faTrashCan,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const profileMenuRef = useRef(null);

  const handleListRoomClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/rooms/add');
    } else {
      navigate('/login')
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: faHome },
    { name: 'Find Rooms', path: '/rooms', icon: faSearch },
    { name: 'List Your Room', path: '/rooms/add', icon: faDoorOpen, onClick: handleListRoomClick }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleProfile = () => {
    navigate('/dashboard/');
    setIsProfileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      ref={ref}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-md py-3" 
          : "bg-sky-600 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHome} className={`text-2xl ${isScrolled ? 'text-sky-600' : 'text-white'}`} />
            <span className={`text-2xl font-bold ${isScrolled ? 'text-sky-600' : 'text-white'}`}>
              StayNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.onClick ? (
                <button
                  key={link.path}
                  onClick={link.onClick}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? isScrolled ? 'text-sky-600' : 'text-white'
                      : isScrolled ? 'text-gray-600 hover:text-sky-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
                  <span>{link.name}</span>
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? isScrolled ? 'text-sky-600' : 'text-white'
                      : isScrolled ? 'text-gray-600 hover:text-sky-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              )
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-sky-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="text-sky-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-sky-700">{user?.name}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg py-2 ring-1 ring-black ring-opacity-5"
                    ref={profileMenuRef}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-sky-800">{user?.name}</p>
                      <p className="text-xs text-sky-600">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleProfile}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-sky-700 hover:bg-sky-50"
                    >
                      <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogoutConfirm}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-sky-700 hover:bg-sky-50"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sky-100 transition-colors"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon 
              icon={isMenuOpen ? faTimes : faBars} 
              className="w-6 h-6 text-sky-600"
            />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Pop-up */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-300">
            <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">Are you sure?</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
                Do you really want to continue? This action<br/>cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
                <button 
                  type="button" 
                  className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
                  onClick={handleCancelLogout}
                >
                    Cancel
                </button>
                <button 
                  type="button" 
                  className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
                  onClick={handleLogout}
                >
                    Confirm
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-sky-100">
            <Link to="/" className="flex items-center gap-2">
              <FontAwesomeIcon icon={faHome} className="text-2xl text-sky-600" />
              <span className="text-2xl font-bold text-sky-600">
                StayNest
              </span>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-sky-100 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6 text-sky-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isAuthenticated && (
              <div className="flex items-center gap-3 p-4 mb-4 rounded-lg bg-sky-50">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-sky-600" />
                </div>
                <div>
                  <p className="font-medium text-sky-800">{user?.name}</p>
                  <p className="text-sm text-sky-600">{user?.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((link) => (
                link.onClick ? (
                  <button
                    key={link.path}
                    onClick={(e) => {
                      link.onClick(e);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-sky-100 text-sky-600'
                        : 'text-sky-700 hover:bg-sky-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
                    <span>{link.name}</span>
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-sky-100 text-sky-600'
                        : 'text-sky-700 hover:bg-sky-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                )
              ))}
            </div>

            <div className="mt-6 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-sky-700 hover:bg-sky-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogoutConfirm();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-sky-700 hover:bg-sky-50"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-sky-600 border-2 border-sky-600 hover:bg-sky-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white bg-sky-600 hover:bg-sky-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
