import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { 
    faInstagram,
    faFacebookF,
    faTwitter,
    faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className='bg-sky-50 text-sky-700 pt-16 pb-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                    <div className='space-y-6'>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faHome} className="text-2xl text-sky-600" />
                            <span className='text-2xl font-bold text-sky-600'>
                                StayNest
                            </span>
                        </div>
                        <p className='text-sm leading-relaxed text-sky-600'>
                            Your perfect home away from home. We connect travelers with unique accommodations and unforgettable experiences.
                        </p>
                        <div className='flex items-center gap-4'>
                            <a href="#" className='w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-300'>
                                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
                            </a>
                            <a href="#" className='w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-300'>
                                <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
                            </a>
                            <a href="#" className='w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-300'>
                                <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
                            </a>
                            <a href="#" className='w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-300'>
                                <FontAwesomeIcon icon={faLinkedinIn} className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className='space-y-6'>
                        <h3 className='text-lg font-semibold text-sky-900'>Company</h3>
                        <ul className='space-y-3'>
                            <li>
                                <a href="/" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/rooms" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    Find Rooms
                                </a>
                            </li>
                            <li>
                                <a href="/rooms/add" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    List Your Room
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className='space-y-6'>
                        <h3 className='text-lg font-semibold text-sky-900'>Support</h3>
                        <ul className='space-y-3'>
                            <li>
                                <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    Safety Information
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    Cancellation Options
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                    Accessibility
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className='space-y-6'>
                        <h3 className='text-lg font-semibold text-sky-900'>Stay Updated</h3>
                        <p className='text-sm text-sky-600'>
                            Subscribe to our newsletter for exclusive deals and travel inspiration.
                        </p>
                        <form className='space-y-3'>
                            <div className='relative'>
                                <input 
                                    type="email" 
                                    className='w-full h-11 px-4 pr-12 rounded-lg border border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-200 outline-none transition-all duration-200' 
                                    placeholder='Enter your email' 
                                />
                                <button 
                                    type="submit"
                                    className='absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 transition-colors duration-200'
                                >
                                    <FontAwesomeIcon icon={'fa-envelope'} className="w-3 h-3" />
                                </button>
                            </div>
                            <p className='text-xs text-sky-500'>
                                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                            </p>
                        </form>
                    </div>
                </div>

                <hr className='border-sky-200 my-8' />
                
                <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                    <p className='text-sm text-sky-600'>
                        © {new Date().getFullYear()} StayNest. All rights reserved.
                    </p>
                    <ul className='flex items-center gap-6 text-sm'>
                        <li>
                            <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a href="#" className='text-sky-600 hover:text-sky-800 transition-colors duration-200'>
                                Sitemap
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 