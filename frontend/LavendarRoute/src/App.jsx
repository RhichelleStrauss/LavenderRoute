import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import gengarSprite from './assets/gengar-sprite.png';

import Catalog from './pages/Catalog'; 
import PokemonAdd from './pages/PokemonAdd';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Navbar from './components/navbar';
import LetterGlitch from './components/LetterGlitch'; 
import LiquidEther from './components/LiquidEther';
import ReflectiveCard from './components/pokemonCard'; 
import Footer from './components/Footer';
import './App.css';
import Product from './pages/Product';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart'

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
        console.error(error);
      }
    };
    getPokemon();
  }, []);

  return (
    <div className="home-fullscreen-container">
      
      <div className="glitch-bg-wrapper">
        <div className="bg-layer bottom-layer">
          <LiquidEther /> 
        </div>

        <div className="bg-layer top-layer">
          <LetterGlitch
            glitchColors={["#7C3AED", "#A855F7"]}
            glitchSpeed={50}
            centerVignette={false}
            outerVignette={false}
            smooth={true}
          />
        </div>
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

                {teamPokemon.length > 0 ? (

                  teamPokemon.map((poke) => (

                    <div key={poke._id} className="card-wrapper">

                      <ReflectiveCard
                      id={poke._id}
          key={poke._id} 

                        pokemonName={poke.name}

                        level={poke.level}

                        type={poke.type}

                        gender={poke.gender}

                        height={poke.height}

                        weight={poke.weight}

                        imgUrl={poke.imagePokemon}
                        shiny={poke.shiny}

                      />

                    </div>
                  ))
                ) : (
                  <p className="pixel-text" style={{ color: '#050505', gridColumn: '1 / -1', textAlign: 'center' }}>
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

      <Footer />

    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
    <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#2A1A3A',
            color: '#BA8CFF',
            border: '1px solid #BA8CFF',
            fontFamily: "'VT323', monospace",
            fontSize: '1.2rem'
          }
        }} 
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/add-pokemon" element={<PokemonAdd />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pokemon/:id" element={<Product />} />
         <Route path='/Dashboard' element={<Dashboard />} />
         <Route path='/Wishlist' element={<Wishlist />} />
         <Route path='/Cart' element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;