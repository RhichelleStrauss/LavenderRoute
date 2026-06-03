import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gengarLogo from '../assets/gengar-logo.png'; 
import '../App.css';
import AddIcon from '../assets/icons/AddIcon.png';
import LogoutIcon from '../assets/icons/LogoutIcon.png'


const Navbar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isAuthorized = roles.includes('admin') || roles.includes('seller') || roles.includes('hybrid');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  };

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
        {isAuthorized && (
          <button onClick={() => navigate('/Dashboard')} className="nav-link-btn">DASH</button>
        )}
      </div>

      <div className="nav-actions">
        {isAuthorized && (
          <img 
            src={AddIcon} 
            alt="Add Pokemon" 
            className="action-icon-png action-icon" 
            onClick={() => navigate('/add-pokemon')} 
            style={{ cursor: 'pointer', width: '28px', height: '28px' }}
          />
        )}

        <svg className="action-icon text-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <div 
          className="profile-container" 
          onMouseEnter={() => setShowLogout(true)} 
          onMouseLeave={() => setShowLogout(false)}

         onClick={() => {
            if (isLoggedIn) {
              if (showLogout) handleLogout();
            } else {
              navigate('/signup');
            }
          }}

          style={{ 
            padding: '10px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent'
            }}
        >
          {showLogout && isLoggedIn ? (
           <img src={LogoutIcon} alt="Logout" className="action-icon" style={{ width: '32px', height: '32px' }} />
          ) : (
            <svg className="action-icon text-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;