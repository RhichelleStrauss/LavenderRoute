import React, { useState } from 'react';
import PokemonAddForm from '../components/PokemonAddForm.jsx';
import LiquidEther from '../components/LiquidEther.jsx'
import MagicBento from '../components/MagicBento.jsx';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';import toast from 'react-hot-toast';



export default function PokemonAdd() {
  return (
    <>

<div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1 
      }}>

  <LiquidEther
    mouseForce={20}
    cursorSize={100}
    isViscous
    viscous={30}
    colors={["#C4FF4D","#C4FF4D","#C4FF4D"]}
    autoDemo
    autoSpeed={0.5}
    autoIntensity={2.2}
    isBounce={false}
    resolution={0.5}

  />
  </div>

      <Navbar />

  <div className="paf-page">
     

            <MagicBento
          className="paf-bento"
          columns={1}
          glowColor="#C4FF4D"
          clickEffect={false}
          style={{ gridAutoRows: 'auto' }}
          items={[{ content: <PokemonAddForm /> }]}
        />

        
        </div>

      <div className="page-footer">
        <Footer glitch />
      </div>


   

</>
  );
}