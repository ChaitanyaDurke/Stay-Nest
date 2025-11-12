import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/properties/my-properties', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError('Could not load properties. Are you logged in?');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // API call to delete property
        // await fetch(`/api/properties/${propertyId}`, {
        //   method: 'DELETE',
        // });
        setProperties(properties.filter(property => property.id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <Link
            to="/add-property"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add New Property
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't added any properties yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link
          to="/add-property"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add New Property
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {property.images && property.images[0] && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
              <p className="text-gray-600 mb-4">{property.location}</p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Price:</span> ${property.price}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Type:</span>{' '}
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/edit-property/${property.id}`}
                  className="flex-1 bg-indigo-600 text-white text-center px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProperties; 