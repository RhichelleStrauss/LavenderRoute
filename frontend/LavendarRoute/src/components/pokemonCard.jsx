import "../css/reflectiveCard.css";

const ReflectiveCard = ({
  pokemonName,
  level,
  type = [], // Default to empty array to allow .map() to work
  gender,
  stage = "Basic",
  height,
  weight,
  imgUrl,
}) => {
  return (
    <div className="reflective-card-container">
      <div className="card-glass-background" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="pokemon-tags">
            <span className="tag">{stage}</span>
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