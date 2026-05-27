import React, { useState } from 'react';
import PokemonAddForm from '../components/PokemonAddForm.jsx';
import LiquidEther from '../components/LiquidEther.jsx'
import { Container, Card } from 'react-bootstrap';
import Navbar from '../components/navbar';



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

  <Container style={{ position: 'relative', zIndex: 1, paddingTop: '100px', paddingBottom: '60px' }}>
     

        <PokemonAddForm />

        
        </Container>


   

</>
  );
}