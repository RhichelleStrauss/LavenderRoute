import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Catalog from './pages/Catalog'
import ProductAdd from './pages/ProductAdd'
import SignUp from './pages/SignUp'

import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'



function App() {
  return (
  
    <BrowserRouter>

    <div style={{ padding: '20px', display: 'flex', gap: '20px', borderBottom: '1px solid #333' }}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/catalog" className="nav-link">Catalog</Link>
        <Link to="/add-pokemon" className="nav-link">Add Product</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
      </div>
    
    <div style={{ padding: '20px' }}>
        <Routes>

          <Route path="/catalog" element={<Catalog />} />
          <Route path="/add-pokemon" element={<ProductAdd />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        </div>
       
    </BrowserRouter>
  )
}

export default App
