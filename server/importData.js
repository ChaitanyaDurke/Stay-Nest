import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';
import User from './models/User.js';

// Load environment variables from .env file in the server directory
dotenv.config({ path: './.env' });
console.log('Loaded environment variables.');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');

// Directly embed the rooms data
const allRoomsData = [
    {
      title: "Cozy 1BHK near Railway Station",
      description: "A comfortable 1BHK apartment located near the railway station with modern amenities and easy access to public transport.",
      location: "Aurangabad",
      images: [{
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 8500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.2,
        count: 45
      }
    },
    {
      title: "Modern 1BHK in City Center",
      description: "A modern 1BHK apartment in the city center with all the amenities you need.",
      location: "Aurangabad",
      images: [{
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 9500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.0,
        count: 38
      }
    },
    {
      title: "Sunlit 1BHK near University",
      description: "A sunny 1BHK apartment near a university with all the amenities you need.",
      location: "Aurangabad",
      images: [{
        url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 7800,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.3,
        count: 52
      }
    },
    {
      title: "Executive Stay at CBD",
      description: "A luxurious executive stay in the CBD area with all the amenities you need.",
      location: "Panvel, Maharashtra",
      images: [{
        url: "https://media.istockphoto.com/id/2088596186/photo/luxury-modern-living-room.webp?a=1&b=1&s=612x612&w=0&k=20&c=tZw_VkfMtKBee1BJO17HdAmH0_tLEH9ur44QwZfIgj8=",
        isMain: true
      }],
      price: {
        amount: 1999,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        parking: true,
        pool: true,
        gym: true,
        security: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.6,
        count: 126
      },
      isCompanyServiced: true
    },
    {
      title: "Spacious 2BHK Flat",
      description: "A spacious 2BHK flat with all the amenities you need.",
      location: "Pune",
      images: [{
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 22000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.2,
        count: 89
      }
    },
    {
      title: "Luxury 3BHK Apartment",
      description: "A luxurious 3BHK apartment with all the amenities you need.",
      location: "Nagpur",
      images: [{
        url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 35000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        pool: true
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 3,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.8,
        count: 156
      }
    },
    {
      title: "Cozy 1BHK with Balcony",
      description: "A cozy 1BHK apartment with a balcony and all the amenities you need.",
      location: "Nashik",
      images: [{
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 12000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.0,
        count: 45
      }
    },
    {
      title: "Elegant 2BHK Penthouse",
      description: "An elegant 2BHK penthouse with all the amenities you need.",
      location: "Thane",
      images: [{
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 28000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        pool: true,
        gym: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.7,
        count: 112
      }
    },
    {
      title: "Studio Apartment",
      description: "A cozy studio apartment with all the amenities you need.",
      location: "Aurangabad",
      images: [{
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN0dWRpbyUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 15000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.3,
        count: 78
      }
    },
    {
      title: "Modern 3BHK with Garden",
      description: "A modern 3BHK apartment with a beautiful garden.",
      location: "Pune",
      images: [{
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 25000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        garden: true
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.5,
        count: 100
      }
    },
    {
      title: "Luxury 4BHK Villa",
      description: "A luxurious 4BHK villa with all the amenities you need.",
      location: "Navi Mumbai",
      images: [{
        url: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 45000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        pool: true,
        gym: true,
        garden: true
      },
      specifications: {
        bedrooms: 4,
        bathrooms: 4,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.9,
        count: 180
      }
    },
    {
      title: "2BHK Apartment",
      description: "A cozy 2BHK apartment with all the amenities you need.",
      location: "Aurangabad",
      images: [{
        url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 18000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.1,
        count: 50
      }
    },
    {
      title: "Luxury 2BHK with Sea View",
      description: "A luxurious 2BHK apartment with a beautiful sea view.",
      location: "Ratnagiri",
      images: [{
        url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA5fHxtdW1iYWklMjBhcGFydG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 35000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        seaView: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.7,
        count: 90
      }
    },
    {
      title: "Sunlit 2BHK near IT Park",
      description: "A sunny 2BHK apartment near an IT park with all the amenities you need.",
      location: "Kalyan",
      images: [{
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHB1bmUlMjBhcGFydG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 22000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.4,
        count: 70
      }
    },
    {
      title: "Cozy 2BHK near Vineyards",
      description: "A cozy 2BHK apartment near vineyards with all the amenities you need.",
      location: "Aurangabad",
      images: [{
        url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5hc2hpayUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 15000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.0,
        count: 30
      }
    },
    {
      title: "Modern Studio in Koregaon Park",
      description: "A modern studio apartment in Koregaon Park with all the amenities you need.",
      location: "Pune",
      images: [{
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvb218ZW58MHx8MHx8fDA%3D",
        isMain: true
      }],
      price: {
        amount: 10500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.2,
        count: 50
      }
    },
    {
      title: "Affordable Apartment in Andheri",
      description: "An affordable apartment in Andheri with all the amenities you need.",
      location: "Mumbai",
      images: [{
        url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 6500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: false
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 3.8,
        count: 20
      }
    },
    {
      title: "Luxury 3BHK near Connaught Place",
      description: "A luxurious 3BHK apartment near Connaught Place with all the amenities you need.",
      location: "New Delhi",
      images: [{
        url: "https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
        isMain: true
      }],
      price: {
        amount: 25000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        pool: true,
        gym: true
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.9,
        count: 150
      }
    },
    {
      title: "Bright 1BHK near MG Road",
      description: "A bright 1BHK apartment near MG Road with all the amenities you need.",
      location: "Bengaluru",
      images: [{
        url: "https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
        isMain: true
      }],
      price: {
        amount: 14500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.3,
        count: 60
      }
    },
    {
      title: "Peaceful 2BHK in Civil Lines",
      description: "A peaceful 2BHK apartment in Civil Lines with all the amenities you need.",
      location: "Nagpur",
      images: [{
        url: "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
        isMain: true
      }],
      price: {
        amount: 12000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.0,
        count: 30
      }
    },
    {
      title: "Private Room near Hinjewadi IT Park",
      description: "A private room near Hinjewadi IT Park with all the amenities you need.",
      location: "Pune",
      images: [{
        url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
        isMain: true
      }],
      price: {
        amount: 8000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: false
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 3.9,
        count: 10
      }
    },
    {
      title: "Apartment in Bandra West",
      description: "An apartment in Bandra West with all the amenities you need.",
      location: "Mumbai",
      images: [{
        url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJvb218ZW58MHx8MHx8fDA%3D",
        isMain: true
      }],
      price: {
        amount: 7500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: false
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 3.7,
        count: 15
      }
    },
    {
      title: "Chic Studio in Hauz Khas",
      description: "A chic studio apartment in Hauz Khas with all the amenities you need.",
      location: "New Delhi",
      images: [{
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 18000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.5,
        count: 80
      }
    },
    {
      title: "Spacious 2BHK in Rajarhat",
      description: "A spacious 2BHK apartment in Rajarhat with all the amenities you need.",
      location: "Kolkata",
      images: [{
        url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
        isMain: true
      }],
      price: {
        amount: 11500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.2,
        count: 50
      }
    },
    {
      title: "Premium Apartment near Cyber City",
      description: "A premium apartment near Cyber City with all the amenities you need.",
      location: "Gurgaon",
      images: [{
        url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 20500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        pool: true,
        gym: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.8,
        count: 100
      }
    },
    {
      title: "Budget Studio in Kothrud",
      description: "A budget studio apartment in Kothrud with all the amenities you need.",
      location: "Pune",
      images: [{
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 9000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 3.5,
        count: 20
      }
    },
    {
      title: "Apartment in Lakdi ka Pul",
      description: "An apartment in Lakdi ka Pul with all the amenities you need.",
      location: "Hyderabad",
      images: [{
        url: "https://media.istockphoto.com/id/1990444472/photo/scandinavian-style-cozy-living-room-interior.webp?a=1&b=1&s=612x612&w=0&k=20&c=F5A3eF6myaJpITu5ABnGqNjacGWYskuxeZviU-KpxPE=",
        isMain: true
      }],
      price: {
        amount: 6000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: false
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 3.0,
        count: 10
      }
    },
    {
      title: "Entire Apartment in Salt Lake",
      description: "An entire apartment in Salt Lake with all the amenities you need.",
      location: "Kolkata",
      images: [{
        url: "https://images.unsplash.com/photo-1554995207-14f50f6f7c92?auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 16000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.3,
        count: 70
      }
    },
    {
      title: "Modern Private Room in Camp",
      description: "A modern private room in Camp with all the amenities you need.",
      location: "Pune",
      images: [{
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvb218ZW58MHx8MHx8fDA%3D",
        isMain: true
      }],
      price: {
        amount: 7800,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: false
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 4.1,
        count: 30
      }
    },
    {
      title: "Stylish 1BHK in Jubilee Hills",
      description: "A stylish 1BHK apartment in Jubilee Hills with all the amenities you need.",
      location: "Hyderabad",
      images: [{
        url: "https://images.unsplash.com/photo-1559841644-08984562005a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
        isMain: true
      }],
      price: {
        amount: 13000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.4,
        count: 50
      }
    },
    {
      title: "Luxury 2BHK near Powai Lake",
      description: "A luxurious 2BHK apartment near Powai Lake with all the amenities you need.",
      location: "Mumbai",
      images: [{
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=60",
        isMain: true
      }],
      price: {
        amount: 24000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true,
        pool: true,
        gym: true
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.9,
        count: 100
      }
    },
    {
      title: "Compact Studio in Viman Nagar",
      description: "A compact studio apartment in Viman Nagar with all the amenities you need.",
      location: "Pune",
      images: [{
        url: "https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
        isMain: true
      }],
      price: {
        amount: 8200,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 4.0,
        count: 20
      }
    },
    {
      title: "Apartment in Shivaji Nagar",
      description: "An apartment in Shivaji Nagar with all the amenities you need.",
      location: "chhatrapati sambhaji nagar",
      images: [{
        url: "https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
        isMain: true
      }],
      price: {
        amount: 5800,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: false
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 3.5,
        count: 10
      }
    },
    {
      title: "Elegant 3BHK in Vasant Kunj",
      description: "An elegant 3BHK apartment in Vasant Kunj with all the amenities you need.",
      location: "New Delhi",
      images: [{
        url: "https://images.unsplash.com/photo-1559841644-08984562005a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
        isMain: true
      }],
      price: {
        amount: 19000,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: true,
        elevator: true,
        ac: true,
        kitchen: true
      },
      specifications: {
        bedrooms: 3,
        bathrooms: 2,
        area: 500,
        furnishing: "fully-furnished"
      },
      rating: {
        average: 4.7,
        count: 80
      }
    },
    {
      title: "Budget Private Room in chhatrapati sambhaji nagar",
      description: "A budget private room in chhatrapati sambhaji nagar with all the amenities you need.",
      location: "chhatrapati sambhaji nagar",
      images: [{
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJvb218ZW58MHx8MHx8fDA%3D",
        isMain: true
      }],
      price: {
        amount: 6500,
        currency: "INR",
        period: "night"
      },
      amenities: {
        wifi: true,
        tv: false,
        elevator: false,
        ac: true,
        kitchen: false
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnishing: "unfurnished"
      },
      rating: {
        average: 3.8,
        count: 10
      }
    }
];

const importData = async () => {
    try {
        console.log('Attempting to connect to DB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB connection successful!');

        // Find an existing user to use as owner
        console.log('Attempting to find an existing user...');
        const existingUser = await User.findOne();
        if (!existingUser) {
            throw new Error('No existing user found. Please create a user first.');
        }
        console.log(`Found existing user with email: ${existingUser.email}`);

        // Prepare properties for insertion
        console.log('Preparing properties for insertion...');
        const propertiesToInsert = allRoomsData.map(room => ({
            ...room,
            owner: existingUser._id,
            status: 'available'
        }));

        console.log(`Attempting to insert ${propertiesToInsert.length} properties...`);
        await Property.insertMany(propertiesToInsert);
        console.log('Data import successful!');

    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed.');
    }
};

importData();