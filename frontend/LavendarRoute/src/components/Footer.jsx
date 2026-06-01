import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';
import gengarLogo from '../assets/gengar-logo.png';

const Footer = () => {
  return (
    <footer className="misty-glass-panel footer-container">
      <div className="footer-grid">
        

        <div className="footer-section">
          <div className="footer-brand-header">
            <img src={gengarLogo} alt="LavendarRoute Logo" className="footer-logo" />
            <h3 className="pixel-heading footer-title text-purple">LavendarRoute</h3>
          </div>
          <p className="slogan-text">
            The premier darknet marketplace for buying, selling, and smuggling rare Pokémon. Encrypted trades, anonymous transactions, and zero traces.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="pixel-heading footer-subtitle">Shadow Nodes</h4>
          <div className="footer-links-col">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/catalog" className="footer-link">Inventory</Link>
            <Link to="/add-pokemon" className="footer-link">List an Asset</Link>
            <Link to="/login" className="footer-link">Login</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="pixel-heading footer-subtitle">The Architects</h4>
          <div className="footer-links-col dev-team-links">
            <a href="https://github.com/WihanBurger?tab=overview&from=2025-12-01&to=2025-12-31" target="_blank" rel="noopener noreferrer" className="github-link">
              <span className="text-lime">{'>'}</span> Wihan
            </a>
            <a href="https://github.com/Nell-JvR-251061" target="_blank" rel="noopener noreferrer" className="github-link">
              <span className="text-lime">{'>'}</span> Nell
            </a>
            <a href="https://github.com/JeanWayneFoord251247" target="_blank" rel="noopener noreferrer" className="github-link">
              <span className="text-lime">{'>'}</span> Jean
            </a>
            <a href="https://github.com/RhichelleStrauss" target="_blank" rel="noopener noreferrer" className="github-link">
              <span className="text-lime">{'>'}</span> Rhichelle
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom-bar">
        <p className="pixel-text copyright-text">© 2026 LavendarRoute. Operating on the Tor Network.</p>
      </div>
    </footer>
  );
};

export default Footer;