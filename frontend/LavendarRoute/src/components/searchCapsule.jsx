import React from "react";
import "../css/searchCapsule.css";

export default function SearchCapsule({
  filterIcon,
  searchIcon,
  magnify,
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedGender,
  setSelectedGender,
  selectedShiny,
  setSelectedShiny
}) {
  return (
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

        <div className="search-actions-group">
          <div className="sort-select-wrapper">
            <img src={searchIcon} alt="Sort" className="sort-asset-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="capsule-sort-select"
            >
              <option value="">SORT BY</option>
              <option value="level-desc">LVL: HIGHEST</option>
              <option value="level-asc">LVL: LOWEST</option>
              <option value="name-asc">NAME: A-Z</option>
              <option value="name-desc">NAME: Z-A</option>
            </select>
          </div>

          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="search..."
              className="capsule-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">
              <img src={magnify} alt="MagnifyGlass" className="search-asset-icon" />
            </span>
          </div>
        </div>
      </div>

      <div className={`filter-drawer ${isFilterDrawerOpen ? "open" : ""}`}>
        <div className="drawer-inner-grid">
          <div className="drawer-field">
            <label>ELEMENTAL TYPE</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
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
            <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="">ALL GENDERS</option>
              <option value="Male">MALE</option>
              <option value="Female">FEMALE</option>
              <option value="Genderless">GENDERLESS</option>
            </select>
          </div>

          <div className="drawer-field">
            <label>GENETIC VARIANT</label>
            <select value={selectedShiny} onChange={(e) => setSelectedShiny(e.target.value)}>
              <option value="">ALL VARIANTS</option>
              <option value="Basic">BASIC FORM</option>
              <option value="Shiny">SHINY VARIANT</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}