import React from 'react';
import '../css/PokePattern.css';
import PokeballOpen from './PokeballOpen.jsx'

import OgerponToken from '../assets/tokens/OgerponToken.png'
import RayquazaToken from '../assets/tokens/RayquazaToken.png'
import SableyeToken from '../assets/tokens/SableyeToken.png'
import SquirtleToken from '../assets/tokens/SquirtleToken.png'
import ZekromToken from '../assets/tokens/ZekromToken.png'
import ZoroarkToken from '../assets/tokens/ZoroarkToken.png'

import BinIcon from '../assets/icons/BinIcon.png';

//braindump - rhi
//on sign up there will be 2-3 'steps', select type of user then name, surname, date of birth (verifying over 18), 
// if thats good then next step, set password and patterns
// admins have their own secret "pin" based on their fav pokemon, try to get each admin to have their own?
//want - having users to setup their account with "avatar" - token with pokemon
//username displayed will be sliced first name - only first letter displays 
//buyers-can view, review, add to cart, add comments and wishlsit
//sellers - view, comment, post, view listings 
//admin - view everything, delete posts, approve posts, delete comments, users
//review system- if seller has submitted 3 successful posts according to rules, future posts dont need admin approval
//vice versa, 3 bad posts - restricted account??
//hybrid-seller+buyer

export default function PokePattern({ pattern, setPattern }) {
  const availableTokens = ['zoroark', 'squirtle', 'ogerpon', 'rayquaza', 'sableye', 'zekrom'];

  const tokenDisplay = {
    zoroark: ZoroarkToken,
    squirtle: SquirtleToken,
    ogerpon: OgerponToken,
    rayquaza: RayquazaToken,
    sableye: SableyeToken,
    zekrom: ZekromToken
  };

  const handleTokenClick = (token) => {
    if (pattern.length < 12) {
      setPattern([...pattern, token]);
    }
  };

  const handleRemoveToken = (indexToRemove) => {
    setPattern(pattern.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <label style={{ marginBottom: '5px' }}>Pokémon Pattern (Choose 6-12 tokens):</label>

      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'nowrap',
          justifyContent: 'center', 
          marginBottom: '20px',
          width: '100%',
          height: '100%'
        }}
      >
        {availableTokens.map((token, index) => (
          <PokeballOpen
            key={index}
            tokenName={token}
            tokenImage={tokenDisplay[token]} 
            onTokenSelect={handleTokenClick}
          />
        ))}
      </div>

    
      <div className="pattern-display-box">
        {pattern.length === 0 ? (
          <span className="empty-pattern-text">Your pattern will appear here...</span>
        ) : (
          pattern.map((token, index) => (
            <div
              key={index}
              onClick={() => handleRemoveToken(index)}
              className="selected-token-wrapper"
            >
              <img
                src={tokenDisplay[token]}
                alt={token}
                className="selected-token-img"
              />
              <div
                className="bin-icon-mask"
                style={{
                  maskImage: `url(${BinIcon})`,
                  WebkitMaskImage: `url(${BinIcon})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
    