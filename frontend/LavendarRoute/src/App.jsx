import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Catalog from "./pages/catalog.jsx";
import PokemonAdd from "./pages/PokemonAdd.jsx";
import SignUp from "./pages/SignUp.jsx";
import "./App.css";
import GlitchText from "./components/glitchText.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="navBar">
        <div className="brandIdentity">
          <GlitchText
            speed={1}
            enableShadows
            enableOnHover={false}
            className="custom-class"
          >
            Lavender Route
          </GlitchText>
        </div>

        <div className="pageLinks">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/catalog" className="nav-link">
            Catalog
          </Link>
          <Link to="/add-pokemon" className="nav-link">
            Add Pokemon
          </Link>
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        </div>

        <div className="actionIcons">

        </div>
        
      </div>
      <div className="content-container">
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/add-pokemon" element={<PokemonAdd />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
