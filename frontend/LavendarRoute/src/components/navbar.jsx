import React from 'react';
import { useNavigate } from 'react-router-dom';
import gengarLogo from '../assets/gengar-logo.png'; 

const Navbar = () => {
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
        <svg className="action-icon text-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        
        <svg 
          onClick={() => navigate('/signup')}
          className="action-icon text-lime" 
          style={{ cursor: 'pointer' }}
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
    </nav>
  );
};

export default Navbar;