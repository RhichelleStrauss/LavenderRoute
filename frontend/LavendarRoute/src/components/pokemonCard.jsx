import "../css/reflectiveCard.css";

const ReflectiveCard = ({
  pokemonName = "PICKACHU",
  level = "52",
  type = "Electric",
  gender = "Male",
  stage = "Basic",
  height = "0.4 m",
  weight = "6 kg",
  imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
}) => {
  return (
    <div className="reflective-card-container">
      <div className="card-glass-background" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="pokemon-tags">
            <span className="tag">{stage}</span>{" "}
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
            <span>Height: {height}</span>
            <span>Weight: {weight}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;
