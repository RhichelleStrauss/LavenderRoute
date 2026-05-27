import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import gengarSprite from './assets/gengar-sprite.png';

import Catalog from './pages/Catalog'; 
import PokemonAdd from './pages/PokemonAdd';
import SignUp from './pages/SignUp';
import Navbar from './components/navbar';
import LetterGlitch from './components/LetterGlitch'; 
import './App.css';

const Home = () => {
  return (
    <div className="home-fullscreen-container">
      
      <div className="glitch-bg-wrapper">
        <LetterGlitch
          glitchColors={["#7C3AED", "#A855F7"]}
          glitchSpeed={50}
          centerVignette={false}
          outerVignette={false}
          smooth={true}
        />
      </div>
      
      <Navbar />

      <main className="home-main-content">
        
        <div className="top-split">
          
          <div className="left-column">
            
            <section className="misty-glass-panel">
              <h2 className="pixel-heading">About us</h2>
              <p className="body-text">
                A shadowy hub for serious Pokémon traders, where rare finds and elite builds change hands fast. Built on privacy, trust, and reputation, our platform connects collectors who value discretion as much as the thrill of the trade.
              </p>
            </section>

            <section className="misty-glass-panel featured-panel">
              <h2 className="pixel-heading">Featured products</h2>
              <div className="products-grid">
              </div>
            </section>

          </div>

          <div className="right-column">
            <img 
              src={gengarSprite} 
              alt="Giant Gengar Sprite" 
              className="giant-sprite" 
            />
          </div>

        </div>

        <section className="misty-glass-panel bottom-panel">
          <h2 className="pixel-heading">How it works</h2>
          <p className="body-text">
            Create an account, verify your profile, and set up your payout method. Sellers list their Pokémon with clear details, set a price or auction, and agree to platform rules. Once approved, listings go live in the marketplace.
          </p>
          <br/>
          <p className="body-text">
            When a buyer purchases, the platform holds payment in escrow. The seller completes the in-game trade within the agreed window and provides proof of delivery. After the buyer confirms, funds are released.
          </p>
        </section>

      </main>
    </div>
  );
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/add-pokemon" element={<PokemonAdd />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
