import React from 'react';
import { useNavigate } from 'react-router-dom';
import gengarLogo from '../assets/gengar-logo.png'; 
import '../App.css';
import AddIcon from '../assets/icons/AddIcon.png';
import profileIcon from '../assets/icons/ProfileIcon.png';
import cartIcon from '../assets/icons/CartIcon.png';
import settingsIcon from '../assets/icons/SettingsIcon.png';
import heartIcon from '../assets/icons/HeartNotFilledIcon.png';
import '../css/Navbar.css';

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();

  return (
    <nav className="misty-glass-nav">
      <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={gengarLogo} alt="Logo" className="nav-icon" />
        <h1 className="nav-brand">
          <span className="text-purple">LAVENDER</span> <span className="text-lime">ROUTE</span>
        </h1>
      </div>
      
      <div className="nav-links">
        <button onClick={() => navigate('/')} className="nav-link-btn active">HOME</button>
        <button onClick={() => navigate('/catalog')} className="nav-link-btn">INVENTORY</button>
      </div>

      <div className="nav-actions">
        <img 
          src={AddIcon} 
          alt="Add Pokemon" 
          title="List an Asset"
          className="action-icon-png" 
          onClick={() => navigate('/add-pokemon')} 
          style={{ cursor: 'pointer', width: '28px', height: '28px' }}
        />
        
        <img 
          src={heartIcon} 
          alt="Wishlist" 
          title="Wishlist"
          className="action-icon action-icon-png"
          onClick={() => navigate('/wishlist')}
          style={{ cursor: 'pointer' }}
        />

        <svg className="action-icon text-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" onClick={() => navigate('/cart')} style={{ cursor: 'pointer', width: '28px', height: '28px' }}>
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        <img 
          src={profileIcon} 
          alt="Profile" 
          title="Trainer Login / Encrypted Access"
          className="action-icon action-icon-png"
          onClick={() => navigate('/signup')}
          style={{ cursor: 'pointer' }}
        />

        {(userRole === 'admin' || userRole === 'seller') && (
          <img 
            src={settingsIcon} 
            alt="Dashboard Settings" 
            title="Trainer Dashboard"
            className="action-icon action-icon-png"
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;