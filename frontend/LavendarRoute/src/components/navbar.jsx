import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import gengarLogo from '../assets/gengar-logo.png'; 
import AddIcon from '../assets/icons/AddIcon.png';
import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    navigate('/');
    window.location.reload();

  };

  return (
    <nav className="misty-glass-nav">
      
      <div className="nav-logo clickable-logo" onClick={() => { navigate('/'); closeMenu(); }}>
        <img src={gengarLogo} alt="LavendarRoute Logo" className="nav-icon" />
        <h1 className="nav-brand">
          <span className="text-purple">LAVENDER</span> <span className="text-lime">ROUTE</span>
        </h1>
      </div>

      <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle Navigation">
        {isMenuOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>
      
      <div className={`nav-content ${isMenuOpen ? 'open' : ''}`}>
        
        <div className="nav-links">
          <NavLink to="/" className="nav-link-btn" onClick={closeMenu}>HOME</NavLink>
          <NavLink to="/catalog" className="nav-link-btn" onClick={closeMenu}>INVENTORY</NavLink>
        </div>

        <div className="nav-actions">
          <img 
            src={AddIcon} 
            alt="Add Asset" 
            title="List an Asset"
            className="action-icon action-icon-png" 
            onClick={() => { navigate('/add-pokemon'); closeMenu(); }} 
          />

          <svg className="action-icon text-lime" title="Shadow Network Alerts" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          
          <svg 
            onClick={() => { navigate('/signup'); closeMenu(); }}
            className="action-icon text-lime" 
            title="Trainer Login / Encrypted Access"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
