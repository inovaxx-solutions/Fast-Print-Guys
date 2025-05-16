// src/components/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaCaretDown } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/nav_logo.png';

// Import the useAuth hook to consume the Authentication Context
import { useAuth } from '../../contexts/AuthContext.jsx'; // Adjust the path and extension if needed

const Navbar = () => {
  // Consume Authentication Context
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  // --- Existing UI State ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [authCheck, setAuthCheck] = useState(false);

  // --- Existing Effect for Scroll Handling ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setAuthCheck(isAuthenticated);
  }, [isAuthenticated]);

  // --- Existing Toggle Handlers ---
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  // --- Handler for Logout (Uses AuthContext's logout function) ---
  const handleLogout = async () => {
    console.log('Logging out...');
    await logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to the login page after logout
  };

  console.log('Navbar: isAuthenticated:', isAuthenticated);
  console.log('Navbar: Current user:', user);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="FastPrint" />
          </Link>
        </div>

        <nav className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>
            <li className="navbar-item has-dropdown">
              <div
                className="navbar-link dropdown-toggle"
                onClick={toggleProductsDropdown}
                aria-haspopup="true"
                aria-expanded={isProductsDropdownOpen}
              >
                Products <FaCaretDown className="dropdown-arrow" />
              </div>
              {isProductsDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/products/paperback">Paperback</Link></li>
                  <li><Link to="/products/hardcover">Hardcover</Link></li>
                  <li><Link to="/products/ebook">E-book</Link></li>
                  <li><Link to="/products/bundles">Bundles</Link></li>
                  <li><Link to="/products">All Products</Link></li>
                </ul>
              )}
            </li>
            <li className="navbar-item">
              <Link to="/blogs" className="navbar-link">Blogs</Link>
            </li>
            <li className="navbar-item">
              <Link to="/print-shop" className="navbar-link">Print shop</Link>
            </li>
            <li className="navbar-item">
              <Link to="/pricing" className="navbar-link">Pricing</Link>
            </li>
          </ul>
        </nav>

        <div className="navbar-actions">
          {/* Conditional Rendering based on AuthContext's state */}
          {isAuthLoading ? (
            <span>Loading...</span>
          ) : isAuthenticated ? (
            <>
              {/* If authenticated, show cart icon, user profile link, and logout button */}
              <div className="cart-icon-container">
                <Link to="/cart" className="navbar-icon-link">
                  <FiShoppingCart />
                </Link>
              </div>

              <Link to="/profile" className="navbar-link user-profile-link">
                <FiUser className="user-icon" />
                {user?.name || 'Profile'} {/* Use user data from context */}
              </Link>

              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              {/* If not authenticated, show Login link */}
              <Link to="/login" className="btn btn-outline">Login</Link>

              {/* Cart Icon */}
              <div className="cart-icon-container">
                <Link to="/cart" className="navbar-icon-link">
                  <FiShoppingCart />
                </Link>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="navbar-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="navbar-toggle-icon"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;