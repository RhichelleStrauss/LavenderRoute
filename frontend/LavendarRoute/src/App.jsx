import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import gengarSprite from './assets/gengar-sprite.png';

import Catalog from './pages/Catalog'; 
import PokemonAdd from './pages/PokemonAdd';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Navbar from './components/navbar';
import LetterGlitch from './components/LetterGlitch'; 
import ReflectiveCard from './components/pokemonCard'; 
import './App.css';

const Home = () => {
  
  const [teamPokemon, setTeamPokemon] = useState([]);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pokemon'); 
        const data = await response.json();
        if (data && data.length > 0) {
          setTeamPokemon(data.slice(0, 3)); 
        }
      } catch (error) {
        console.error("The backend is shy today:", error);
      }
    };
    getPokemon();
  }, []);

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
              
              <div className="products-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '10px', 
                marginTop: '20px',
                width: '100%',
                marginBottom: '-60px'
              }}>
                
                {teamPokemon.length > 0 ? (
                  teamPokemon.map((poke) => (
                    <div key={poke._id} style={{ 
                      transform: 'scale(0.85)', 
                      transformOrigin: 'top center', 
                      width: '100%', 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}>
                      <ReflectiveCard
                        pokemonName={poke.name}
                        level={poke.level}
                        type={poke.type}
                        gender={poke.gender}
                        height={poke.height}
                        weight={poke.weight}
                        imgUrl={poke.imagePokemon}
                      />
                    </div>
                  ))
                ) : (
                  <p className="pixel-text" style={{ color: '#050505', gridColumn: 'span 3', textAlign: 'center' }}>
                    Scanning for lifeforms...
                  </p>
                )}

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
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
