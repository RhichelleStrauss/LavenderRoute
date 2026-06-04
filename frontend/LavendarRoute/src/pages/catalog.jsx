import React, { useState, useEffect } from "react";
import LiquidEther from "../components/LiquidEther.jsx";
import ReflectiveCard from "../components/pokemonCard.jsx";
import SearchCapsule from "../components/SearchCapsule.jsx";
import PokemonAddForm from "../components/PokemonAddForm.jsx";
import filterIcon from "../assets/icons/FilterIconRectangle.png";
import searchIcon from "../assets/icons/SortIcon.png";
import magnify from "../assets/icons/MagnifyGlassIcon.png";
import CrossIcon from "../assets/icons/CrossIcon.png";
import "../css/catalog.css";
import Navbar from "../components/navbar.jsx";
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

export default function PokemonAdd() {
  const navigate = useNavigate();
  const [teamPokemon, setTeamPokemon] = useState([
    {
      _id: "test123",
      name: "PIKACHU",
      level: 52,
      type: ["Electric"],
      gender: "Male",
      height: 0.4,
      weight: 6,
      imagePokemon:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    },
  ]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedShiny, setSelectedShiny] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pokemon");
        const data = await response.json();

        const approvedPokemon = data.filter(poke => poke.status === 'approved');
        
        
        setTeamPokemon(approvedPokemon);

      } catch (error) {
        console.error("The backend is shy today:", error);
      }
    };
    getPokemon();
  }, []);



  const filteredPokemon = [...teamPokemon]
    .sort((a, b) => {
      if (sortBy === "level-asc") return a.level - b.level;
      if (sortBy === "level-desc") return b.level - a.level;
      if (sortBy === "name-asc")
        return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc")
        return (b.name || "").localeCompare(a.name || "");
      return 0;
    })
    .filter((poke) => {
      const matchesSearch = (poke.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "" || (poke.type && poke.type.includes(selectedType));

      const matchesGender =
        selectedGender === "" || poke.gender === selectedGender;

      const matchesShiny =
        selectedShiny === "" ||
        (selectedShiny === "Shiny"
          ? poke.shiny === true
          : poke.shiny === false);

      return matchesSearch && matchesType && matchesGender && matchesShiny;
    });


  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      >
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
    

      <div>
        <Navbar />
      </div>
      
       <SearchCapsule
        filterIcon={filterIcon}
        searchIcon={searchIcon}
        magnify={magnify}
        isFilterDrawerOpen={isFilterDrawerOpen}
        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedShiny={selectedShiny}
        setSelectedShiny={setSelectedShiny}
      />
      
    

      <div className="catalog-grid">
  {filteredPokemon.length > 0 ? (
    filteredPokemon.map((poke) => {

      const id = poke._id || poke.id;

        return (
        <ReflectiveCard
          id={id}
          key={id} 
          pokemonName={poke.name}
          level={poke.level}
          type={poke.type}
          gender={poke.gender}
          height={poke.height}
          weight={poke.weight}
          imgUrl={poke.imagePokemon}
          shiny={poke.shiny}
          onClick={() => navigate(`/pokemon/${id}`)}
        />
      );
    })
  ) : (
    <p className="pixel-text" style={{ color: "#C4FF4D" }}>
      Scanning for lifeforms...
    </p>
  )}
</div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(5px)",
            padding: "20px",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <div
            style={{ position: "relative", width: "100%", maxWidth: "800px" }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "48px",
                right: "28px",
                background: "transparent",
                border: "none",
                color: "#BA8CFF",
                fontSize: "24px",
                cursor: "pointer",
                zIndex: 1000,
              }}
            >
              <img
                src={CrossIcon}
                alt="Close"
                style={{ width: "34px", height: "34px", objectFit: "contain" }}
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