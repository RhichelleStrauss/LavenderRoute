import React, { useState, useEffect } from 'react'; // Added useEffect import
import LiquidEther from '../components/LiquidEther.jsx'
import ReflectiveCard from '../components/pokemonCard.jsx';
import '../css/catalog.css'
import PokemonAddForm from '../components/PokemonAddForm.jsx';

import CrossIcon from '../assets/icons/CrossIcon.png';

export default function PokemonAdd() {
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

  //modal for editing ᓚᘏᗢ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  // ᓚᘏᗢ

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

  // opening modal with the correct data from card/backedn
  //opens when card is clicked - modalopeem true 
  const handleEditClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };
  // ᓚᘏᗢ

  //put request handling ᓚᘏᗢ
  const handleUpdatePokemon = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pokemon/${updatedData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setTeamPokemon(prev => prev.map(p => p._id === updatedData._id ? updatedData : p));
        setIsModalOpen(false);
        setSelectedPokemon(null);
      }
    } catch (error) {
      console.error("np updatey:", error);
    }
  };
  //put - updates 
  //map looks at data edited, looks through list - if matching what was uodated UI gets upated
  //ᓚᘏᗢ

  //handle delte post ᓚᘏᗢ
  const handleDeletePokemon = async (id) => {
    if (!window.confirm("suresies you want to delete this cutie pokeman")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/pokemon/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setTeamPokemon(prev => prev.filter(p => p._id !== id));
        setIsModalOpen(false);
        setSelectedPokemon(null);

      }
    }
    catch (error) {
      console.error("no delete:", error);
    }

  };
  //filter removes deleted pokemon, make new list wihgout the poor thing


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
          colors={["#C4FF4D", "#C4FF4D", "#C4FF4D"]}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
        />
      </div>

      <div className="catalog-grid">
        {teamPokemon.length > 0 ? (
          teamPokemon.map((poke) => (
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
            />
          ))
        ) : (
          <p className="pixel-text" style={{ color: '#C4FF4D' }}>
            Scanning for lifeforms...
          </p>
        )}
      </div>
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(5px)', padding: '20px', boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>

            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '48px', right: '28px', background: 'transparent', border: 'none', color: '#BA8CFF', fontSize: '24px', cursor: 'pointer', zIndex: 1000 }}
            >
              <img 
                src={CrossIcon} 
                style={{ width: "34px", height: "34px", objectFit: 'contain' }} 
              />
            </button>

            <PokemonAddForm
              initialData={selectedPokemon}
              onSave={handleUpdatePokemon}
              onDelete={handleDeletePokemon}
              isModal={true}
            />
          </div>
        </div>
      )}
    </>
  );
}