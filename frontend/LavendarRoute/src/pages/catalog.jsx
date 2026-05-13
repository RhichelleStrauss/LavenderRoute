import React, { useState, useEffect } from 'react'; // Added useEffect import
import LiquidEther from '../components/LiquidEther.jsx'
import ReflectiveCard from '../components/pokemonCard.jsx';

export default function PokemonAdd() {
  // Move these INSIDE the function
  const [teamPokemon, setTeamPokemon] = useState([{
    _id: "test123",
    name: "PIKACHU",
    level: 52,
    type: ["Electric"],
    gender: "Male",
    height: 0.4,
    weight: 6,
    imagePokemon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
}]);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pokemon'); 
        const data = await response.json();
        setTeamPokemon(data);
      } catch (error) {
        console.error("The backend is shy today:", error);
      }
    };
    getPokemon();
  }, []);

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

      <div className="catalog-grid">
        {teamPokemon.map((poke) => (
          <ReflectiveCard 
            key={poke._id} 
            pokemonName={poke.name}
            level={poke.level}
            type={poke.type} 
            gender={poke.gender}
            height={poke.height}
            weight={poke.weight}
            imgUrl={poke.imagePokemon}
          />
        ))}
      </div>
    </>
  );
}