import React from 'react';
import './Footer.css'; 
import {Link} from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa'; 
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="site-footer">

      <div className="container footer-main">
        <div className="footer-section footer-left">
          <div className="footer-logo">
            <Link to="/">
              <img src={logo} alt="FastPrint Logo" />
            </Link>
          </div>
          <nav className="footer-nav">
            <ul className="footer-menu">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/products" className="footer-link">Products</a></li>
              <li><a href="/blogs" className="footer-link">Blogs</a></li>
              <li><a href="/print-shop" className="footer-link">Print shop</a></li>
            </ul>
          </nav>
          <div className="footer-social">
               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
               <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
           </div>
        </div>

        {/* Right Section: Subscription */}
        <div className="footer-section footer-right">
           {/* Subscription */}
           <div className="footer-subscribe">
               <p className="footer-text">This is a paragraph with more information about something important.</p>
               <h4 className="footer-subscribe-title">Subscription</h4>
               <div className="subscribe-form">
                   <input type="email" placeholder="Enter Address" className="subscribe-input" aria-label="Enter email address for subscription" />
                   <button type="submit" className="subscribe-button" aria-label="Subscribe">
                       {/* Using the same SVG arrow as before, might need adjustment */}
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                           <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                       </svg>
                       {/* Or a right arrow icon if preferred */}
                       {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                       </svg> */}
                   </button>
               </div>
           </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
          <div className="container footer-bottom-container">
              <p className="footer-copyright">Copyright 2025</p>
              <div className="footer-legal-links">
                  <a href="/privacy-policy" className="footer-link">Privacy & Policy</a>
                  <a href="/terms-conditions" className="footer-link">Terms & Conditions</a>
              </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;