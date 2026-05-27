import React, { useState, useEffect } from "react"; // Added useEffect import
import LiquidEther from "../components/LiquidEther.jsx";
import ReflectiveCard from "../components/pokemonCard.jsx";
import "../css/catalog.css";
import PokemonAddForm from "../components/PokemonAddForm.jsx";
import filterIcon from "../assets/icons/FilterIconRectangle.png";

import CrossIcon from "../assets/icons/CrossIcon.png";

export default function PokemonAdd() {
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

  //modal for editing ᓚᘏᗢ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  // ᓚᘏᗢ

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedShiny, setSelectedShiny] = useState("");
  // ᓚᘏᗢ Tracks if the sliding filter drawer is visible
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pokemon");
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
      const response = await fetch(
        `http://localhost:5000/api/pokemon/${updatedData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        },
      );

      if (response.ok) {
        setTeamPokemon((prev) =>
          prev.map((p) => (p._id === updatedData._id ? updatedData : p)),
        );
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
    if (!window.confirm("suresies you want to delete this cutie pokeman"))
      return;

    try {
      const response = await fetch(`http://localhost:5000/api/pokemon/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTeamPokemon((prev) => prev.filter((p) => p._id !== id));
        setIsModalOpen(false);
        setSelectedPokemon(null);
      }
    } catch (error) {
      console.error("no delete:", error);
    }
  };
  //filter removes deleted pokemon, make new list wihgout the poor thing

  const filteredPokemon = teamPokemon.filter((poke) => {
    const matchesSearch = poke.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "" || (poke.type && poke.type.includes(selectedType));

    const matchesGender =
      selectedGender === "" || poke.gender === selectedGender;

    const matchesShiny =
      selectedShiny === "" ||
      (selectedShiny === "Shiny" ? poke.shiny === true : poke.shiny === false);

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

      <div className="search-capsule-container">
        <div className="search-pill-bar">
          <button
            type="button"
            className={`filter-toggle-btn ${isFilterDrawerOpen ? "active" : ""}`}
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            aria-label="Toggle Filters"
          >
            <img
              src={filterIcon}
              alt="Toggle Filters"
              style={{ width: "24px", height: "24px" }}
            />
          </button>

          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="search..."
              className="capsule-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
        </div>

        <div className={`filter-drawer ${isFilterDrawerOpen ? "open" : ""}`}>
          <div className="drawer-inner-grid">
            <div className="drawer-field">
              <label>ELEMENTAL TYPE</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">ALL TYPES</option>
                <option value="Normal">NORMAL</option>
                <option value="Fire">FIRE</option>
                <option value="Water">WATER</option>
                <option value="Grass">GRASS</option>
                <option value="Electric">ELECTRIC</option>
                <option value="Ice">ICE</option>
                <option value="Fighting">FIGHTING</option>
                <option value="Poison">POISON</option>
                <option value="Ground">GROUND</option>
                <option value="Flying">FLYING</option>
                <option value="Psychic">PSYCHIC</option>
                <option value="Bug">BUG</option>
                <option value="Rock">ROCK</option>
                <option value="Ghost">GHOST</option>
                <option value="Dragon">DRAGON</option>
                <option value="Dark">DARK</option>
                <option value="Steel">STEEL</option>
                <option value="Fairy">FAIRY</option>
                <option value="Stellar">STELLAR</option>
              </select>
            </div>

            <div className="drawer-field">
              <label>GENDER SPECS</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">ALL GENDERS</option>
                <option value="Male">MALE</option>
                <option value="Female">FEMALE</option>
                <option value="Genderless">GENDERLESS</option>
              </select>
            </div>

            <div className="drawer-field">
              <label>GENETIC VARIANT</label>
              <select
                value={selectedShiny}
                onChange={(e) => setSelectedShiny(e.target.value)}
              >
                <option value="">ALL VARIANTS</option>
                <option value="Basic">BASIC FORM</option>
                <option value="Shiny">SHINY VARIANT</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="catalog-grid">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((poke) => (
            <ReflectiveCard
              key={poke._id}
              pokemonName={poke.name}
              level={poke.level}
              type={poke.type}
              gender={poke.gender}
              height={poke.height}
              weight={poke.weight}
              imgUrl={poke.imagePokemon}
              //edit button - onclick handle function
              onEdit={() => handleEditClick(poke)}
            />
          ))
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
