import React from 'react';
import '../css/PokePattern.css';

import OgerponToken from '../assets/tokens/OgerponToken.png'
import RayquazaToken from '../assets/tokens/RayquazaToken.png'
import SableyeToken from '../assets/tokens/SableyeToken.png'
import SquirtleToken from '../assets/tokens/SquirtleToken.png'
import ZekromToken from '../assets/tokens/ZekromToken.png'
import ZoroarkToken from '../assets/tokens/ZoroarkToken.png'

import BinIcon from '../assets/icons/BinIcon.png';

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
      <div className="token-selection-row">
        {availableTokens.map((token, index) => (
          <img
            key={index}
            src={tokenDisplay[token]}
            alt={token}
            onClick={() => handleTokenClick(token)}
            className="token-img"
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
      