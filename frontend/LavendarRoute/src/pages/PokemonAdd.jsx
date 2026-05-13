import React, { useState } from 'react';
import PokemonAddForm from '../components/PokemonAddForm.jsx';
import LiquidEther from '../components/LiquidEther.jsx'
import { Container, Card } from 'react-bootstrap';



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

  <Container style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '60px' }}>
        <Card 
          style={{ 
            maxWidth: '700px', 
            margin: '0 auto',
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #C4FF4D',
            borderRadius: '15px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
            color: '#BA8CFF'
          }}
        >
          <Card.Body style={{ padding: '40px' }}>
            <h2 style={{ color: '#C4FF4D', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'vt323' }}>
              Add New Pokémon
            </h2>

        <PokemonAddForm />

        </Card.Body>
        </Card>
        </Container>


   

</>
  );
}