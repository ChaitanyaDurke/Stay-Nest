import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const BookingConfirmation = ({ bookingDetails, onClose }) => {
  const navigate = useNavigate();
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        ref={printRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 print-area"
      >
        <div className="flex justify-between items-center mb-6 print-header">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-300 print-hidden"
          >
            Back to home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 print-hidden"
          >
            Print
          </motion.button>
        </div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <FontAwesomeIcon icon={faStar} className="text-blue-500 text-4xl mx-1" />
              </motion.div>
            ))}
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Booking Confirmed
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-lg"
          >
            Thank you for your booking! Your reservation has been confirmed.
            <br/>
            Please check your email for the booking details and instructions for your stay.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-lg"
        >
          {[
            { label: 'Booking ID', value: bookingDetails.bookingId || 'N/A' },
            { label: 'Booking Date', value: bookingDetails.bookingDate || 'N/A' },
            { label: 'Hotel Name', value: bookingDetails.hotelName || 'N/A' },
            { label: 'Check-in Date', value: bookingDetails.checkInDate || 'N/A' },
            { label: 'Check-out Date', value: bookingDetails.checkOutDate || 'N/A' },
            { 
              label: 'Total Fare', 
              value: `₹${bookingDetails.totalFare ? bookingDetails.totalFare.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}`
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col"
            >
              <span className="text-gray-500 font-medium">{item.label}</span>
              <span className="text-gray-900 font-semibold">{item.value}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-8 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-all duration-300 print-hidden"
        >
          Close
        </motion.button>
      </motion.div>
      <style>
        {`
        @media print {
          body > *:not(.print-area) {
            display: none !important;
          }
          .print-area {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .print-hidden {
            display: none !important;
          }
          .print-header {
            display: none !important;
          }
        }
        `}
      </style>
    </motion.div>
  );
};

export default BookingConfirmation; 