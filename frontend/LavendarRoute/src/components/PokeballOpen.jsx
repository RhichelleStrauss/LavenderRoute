import React, { useState } from 'react';
import PokeballStill from '../assets/tokens/Pokeball.png'
import PokeballGIF from '../assets/tokens/PokeballOpening.gif'

export default function PokeballOpen({ tokenName, tokenImage, onTokenSelect }) {
  const [ballState, setBallState] = useState('closed');



  const handleClick = () => {
    if (ballState === 'closed') {

        setBallState('opening');

        setTimeout(() => {
        setBallState('revealed');
      }, 800);

      } else if (ballState === 'revealed') {

        onTokenSelect(tokenName);
    }
  };

  return (
    <div 
      onClick={handleClick} 
      className="pokeball-wrapper"
     style={{ 
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%', 
        height: '15%', 
        flexShrink: 0 
      }}
    >
      {ballState === 'closed' && (
        <img 
          src={PokeballStill} 
          alt="Pokeball" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
            }} 
        />
      )}
      
      {ballState === 'opening' && (
        <img 
          src={PokeballGIF} 
          alt="Opening..." 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
          }} 
        />
      )}
      
      {ballState === 'revealed' && (
        <img 
          src={tokenImage} 
          alt={tokenName}
          className="token-bounce"
          style={{ 
            width: '100%',
            height: '100%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.35))'
            }}
        />
      )}
    </div>
  );
}
      