import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About StayNest</h1>
        <p className="about-subtitle">Your trusted partner in finding the perfect stay</p>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At StayNest, we're dedicated to making your stay comfortable and memorable. 
            We believe everyone deserves a perfect place to stay, whether it's for a night 
            or an extended period.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>Quality Rooms</h3>
              <p>Carefully selected and maintained rooms for your comfort</p>
            </div>
            <div className="feature">
              <h3>Easy Booking</h3>
              <p>Simple and secure booking process</p>
            </div>
            <div className="feature">
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer service</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, StayNest has grown from a small startup to a trusted name 
            in room booking. We continue to expand our services while maintaining our 
            commitment to quality and customer satisfaction.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About; 