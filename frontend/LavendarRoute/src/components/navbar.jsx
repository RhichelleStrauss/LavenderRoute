import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import gengarLogo from '../assets/gengar-logo.png'; 
import AddIcon from '../assets/icons/AddIcon.png';
import profileIcon from '../assets/icons/ProfileIcon.png';
import cartIcon from '../assets/icons/CartIcon.png';
import settingsIcon from '../assets/icons/SettingsIcon.png';
import heartIcon from '../assets/icons/HeartNotFilledIcon.png';
import LogoutIcon from '../assets/icons/LogoutIcon.png'; 

import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [showLogout, setShowLogout] = useState(false);

  const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isAuthorized = roles.includes('admin') || roles.includes('seller') || roles.includes('hybrid');
  const isLoggedIn = !!localStorage.getItem('token');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userId');
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
        
        <div className="nav-links" style={{color: '#FFFFFF'}}>
          <NavLink to="/" className="nav-link-btn" onClick={closeMenu}>HOME</NavLink>
          <NavLink to="/catalog" className="nav-link-btn" onClick={closeMenu}>INVENTORY</NavLink>
        </div>


        <div className="nav-actions">
          {isAuthorized && (
            <img 
              src={AddIcon} 
              alt="Add Asset" 
              title="List an Asset"
              className="action-icon action-icon-png" 
              onClick={() => { navigate('/add-pokemon'); closeMenu(); }} 
            />
          )}

          <img 
            src={heartIcon} 
            alt="Wishlist" 
            title="Wishlist"
            className="action-icon action-icon-png"
            onClick={() => { navigate('/wishlist'); closeMenu(); }}
          />

          <img 
            src={cartIcon} 
            alt="Cart" 
            title="Cart"
            className="action-icon action-icon-png" 
            onClick={() => { navigate('/Cart'); closeMenu(); }}
          />

          {isAuthorized && (
            <img 
              src={settingsIcon} 
              alt="Dashboard Settings" 
              title="Trainer Dashboard"
              className="action-icon action-icon-png"
              onClick={() => { navigate('/dashboard'); closeMenu(); }}
            />
          )}

          <div 
            className="profile-container" 
            onMouseEnter={() => setShowLogout(true)} 
            onMouseLeave={() => setShowLogout(false)}
            onClick={() => {
              if (isLoggedIn) {
                handleLogout();
              } else {
                navigate('/signup');
                closeMenu();
              }
            }}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            {showLogout && isLoggedIn ? (
              <img 
                src={LogoutIcon} 
                alt="Logout" 
                title="Disconnect from Network"
                className="action-icon action-icon-png" 
              />
            ) : (
              <img 
                src={profileIcon} 
                alt="Profile" 
                title={isLoggedIn ? "Trainer Profile" : "Trainer Login / Encrypted Access"}
                className="action-icon action-icon-png"
              />
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;