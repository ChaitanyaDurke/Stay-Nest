import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRuler, faUser, faWifi, faTv, faParking, faUtensils, faSnowflake, faMapMarkerAlt, faImage, faMoneyBillWave, faPlus, faMinus, faTag, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const PropertyListingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    price: {
      amount: '',
      currency: 'INR',
      period: 'monthly'
    },
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      floor: '',
      totalFloors: '',
      furnishing: 'unfurnished'
    },
    amenities: {
      wifi: false,
      tv: false,
      ac: false,
      kitchen: false,
      parking: false,
      elevator: false,
      security: false,
      pool: false,
      gym: false
    },
    rules: [],
    nearbyPlaces: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Determine the value based on input type
    const parsedValue = type === 'checkbox' ? checked : (['price.amount', 'specifications.area', 'specifications.floor', 'specifications.totalFloors'].includes(name) ? Number(value) : value);

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parsedValue
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    }
  };

  const handleNumericChange = (name, type) => {
    setFormData(prev => {
      const newValue = type === 'increase' ? prev.specifications[name] + 1 : prev.specifications[name] - 1;
      return {
        ...prev,
        specifications: {
          ...prev.specifications,
          [name]: Math.max(1, newValue)
        }
      };
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      // if (!token) {
      //   navigate('/login');
      //   return;
      // }

      const formDataToSend = new FormData();
      // Append all form data fields
      for (const key in formData) {
        if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
          for (const subKey in formData[key]) {
            formDataToSend.append(`${key}[${subKey}]`, formData[key][subKey]);
          }
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach(item => formDataToSend.append(`${key}[]`, item));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      // Append the image file if it exists
      if (imageFile) {
        formDataToSend.append('imageFile', imageFile);
      }

      const response = await axios.post('http://localhost:5000/api/properties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        alert('Property listed successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          location: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          price: {
            amount: '',
            currency: 'INR',
            period: 'monthly'
          },
          specifications: {
            bedrooms: 1,
            bathrooms: 1,
            area: '',
            floor: '',
            totalFloors: '',
            furnishing: 'unfurnished'
          },
          amenities: {
            wifi: false,
            tv: false,
            ac: false,
            kitchen: false,
            parking: false,
            elevator: false,
            security: false,
            pool: false,
            gym: false
          },
          rules: [],
          nearbyPlaces: []
        });
        // Navigate to properties list
        navigate('/my-properties');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <form className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl space-y-8" onSubmit={handleSubmit}>
        <div className="text-center mb-8">
          <p className="text-sm text-purple-600 font-semibold mb-2">LIST YOUR PROPERTY</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Ready to Host?</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Provide detailed information about your property to attract the perfect tenants. We make listing easy and efficient!</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Property Title <span className="text-red-500">*</span></label>
              <div className="relative">
                <FontAwesomeIcon icon={faTag} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-4"
                  placeholder="e.g., Spacious 2BHK, Cozy Studio"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="price.amount" className="block text-gray-700 font-medium mb-2">Rent per Month <span className="text-red-500">*</span></label>
              <div className="relative">
                <FontAwesomeIcon icon={faMoneyBillWave} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="price.amount"
                  name="price.amount"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-4"
                  placeholder="e.g., 15000"
                  value={formData.price.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Describe your property in detail..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Numeric Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[{
              label: 'Bedrooms',
              name: 'bedrooms',
              icon: faBed
            },
            {
              label: 'Bathrooms',
              name: 'bathrooms',
              icon: faBath
            },
            {
              label: 'Area (sq.ft)',
              name: 'area',
              icon: faRuler,
              isInput: true
            }
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-gray-700 font-medium mb-2">{field.label} <span className="text-red-500">*</span></label>
                <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition-all overflow-hidden">
                  <FontAwesomeIcon icon={field.icon} className="text-gray-500 ml-3" />
                  {field.isInput ? (
                    <input
                      type="number"
                      id={field.name}
                      name={`specifications.${field.name}`}
                      className="w-full p-3 outline-none bg-transparent text-gray-800"
                      placeholder="e.g., 1200"
                      value={formData.specifications[field.name]}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <div className="flex items-center justify-between w-full px-2 py-3">
                      <button type="button" onClick={() => handleNumericChange(field.name, 'decrease')} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors"><FontAwesomeIcon icon={faMinus} /></button>
                      <span>{formData.specifications[field.name]}</span>
                      <button type="button" onClick={() => handleNumericChange(field.name, 'increase')} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors"><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="location"
                name="location"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-4"
                placeholder="Enter property location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="address.street" className="block text-gray-700 font-medium mb-2">Street Address</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Street address"
                value={formData.address.street}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address.city" className="block text-gray-700 font-medium mb-2">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="City"
                value={formData.address.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address.state" className="block text-gray-700 font-medium mb-2">State</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="State"
                value={formData.address.state}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address.zipCode" className="block text-gray-700 font-medium mb-2">ZIP Code</label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="ZIP Code"
                value={formData.address.zipCode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Furnishing Status */}
          <div>
            <label htmlFor="specifications.furnishing" className="block text-gray-700 font-medium mb-2">Furnishing Status</label>
            <select
              id="specifications.furnishing"
              name="specifications.furnishing"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={formData.specifications.furnishing}
              onChange={handleInputChange}
            >
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="fully-furnished">Fully-furnished</option>
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div className="pt-6 border-t border-gray-200">
          <label className="block text-gray-700 font-medium mb-3">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" name="wifi" checked={formData.amenities.wifi} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
              <FontAwesomeIcon icon={faWifi} className="text-purple-500" />
              <span>Wifi</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" name="tv" checked={formData.amenities.tv} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
              <FontAwesomeIcon icon={faTv} className="text-purple-500" />
              <span>TV</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" name="parking" checked={formData.amenities.parking} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
              <FontAwesomeIcon icon={faParking} className="text-purple-500" />
              <span>Parking</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" name="kitchen" checked={formData.amenities.kitchen} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
              <FontAwesomeIcon icon={faUtensils} className="text-purple-500" />
              <span>Kitchen</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700">
              <input type="checkbox" name="ac" checked={formData.amenities.ac} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500" />
              <FontAwesomeIcon icon={faSnowflake} className="text-purple-500" />
              <span>AC</span>
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="pt-6 border-t border-gray-200">
          <label htmlFor="imageFile" className="block text-gray-700 font-medium mb-3">Property Image</label>
          <div className="relative">
            <FontAwesomeIcon icon={faImage} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Listing Property...' : 'List My Property'}
          {!loading && <FontAwesomeIcon icon={faChevronRight} />}
        </button>
      </form>
    </div>
  );
};

export default PropertyListingForm;