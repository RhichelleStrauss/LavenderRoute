import { useState } from 'react';
import "../css/reflectiveCard.css";

import { useNavigate } from "react-router-dom";


const ReflectiveCard = ({
  pokemonName,
  id,
  level,
  type = [],
  gender,
  stage = "Basic",
  height,
  weight,
  imgUrl,
  onEdit,
  shiny
}) => {
  const rotateAmplitude = 14;
  const scaleOnHover = 1.04;
  
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    
    const mouseX = e.clientX - box.left;
    const mouseY = e.clientY - box.top;
    
    const xPct = mouseX / box.width - 0.5;
    const yPct = mouseY / box.height - 0.5;
    
    setRotateX(yPct * -rotateAmplitude);
    setRotateY(xPct * rotateAmplitude);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      className={`reflective-card-container ${shiny ? 'card-shiny' : 'card-basic'}`}
      onClick={onEdit}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        cursor: 'pointer', 
        position: 'relative',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? scaleOnHover : 1}, ${isHovered ? scaleOnHover : 1}, 1)`,
        willChange: 'transform'
      }}
    >
  const navigate = useNavigate();

  return (

   
    <div className="reflective-card-container"
    onClick={() => navigate(`/pokemon/${id}`)}
    style={{ cursor: 'pointer' }}>

      <div className="holo-shimmer-layer" />


      <div className="card-glass-background" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="pokemon-tags">
            <span className={`tag ${shiny ? 'tag-shiny' : ''}`}>
              {shiny ? "SHINY" : stage}
            </span>
            <span className="tag">{gender}</span>

            {type.map((t, index) => (
              <span key={index} className={`tag type-${t.toLowerCase()}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="card-body">
          <img src={imgUrl} alt={pokemonName} className="main-sprite" />
          <div className="identity">
            <h2 className="pixel-text">{pokemonName}</h2>
            <p className="pixel-text">LV {level}</p>
          </div>
        </div>

        <div className="card-footer">
          <div className="stat-box">
            <span>H: {height}m</span>
            <span>W: {weight}kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;