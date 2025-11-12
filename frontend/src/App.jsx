import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import PropertyDetail from './pages/PropertyDetail';
import PropertyListingForm from './components/PropertyListingForm';
import EditProperty from './pages/EditProperty';
import MyBookings from './pages/MyBookings';
import MyProperties from './pages/MyProperties';
import Profile from './pages/Profile';
import Dashboard from './pages/dashboard/Dashboard';
import RecentBookings from './pages/dashboard/RecentBookings';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route
              path="/rooms/add"
              element={
                <PrivateRoute>
                  <PropertyListingForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-property/:id"
              element={
                <PrivateRoute>
                  <EditProperty />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-properties"
              element={
                <PrivateRoute>
                  <MyProperties />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/recent-bookings"
              element={
                <PrivateRoute>
                  <RecentBookings />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
