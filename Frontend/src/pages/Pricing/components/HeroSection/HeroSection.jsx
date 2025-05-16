import './HeroSection.css'
import hero_vector from '../../../../assets/hero_vector.png'; 
import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Pricing <span className="hero-highlight">Calculator</span>
          </h1>
          <p className="hero-description">
            Calculate your book's printing costs, see distribution options, estimate potential earnings, and
            download free templates with our book cost calculator.
          </p>
        </div>
        <div className="hero-image">
          <img
            src={hero_vector}
            alt="Calculator and books illustration"
            className="hero-illustration"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection