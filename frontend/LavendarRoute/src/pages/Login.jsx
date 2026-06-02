import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gengarLogo from '../assets/gengar-logo.png';
import '../css/SignUp.css'; 
import LetterGlitch from '../components/LetterGlitch';
import PokePattern from '../components/PokePattern';
import axios from 'axios';



function Login() {
  const navigate = useNavigate();
  
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokenPattern, setTokenPattern] = useState([]);


  const handleLogin = async (e) => {
  e.preventDefault();
  if (tokenPattern.length < 6) {
      return alert('Pattern must be at least 6 tokens');
    }
    const authPatternString = tokenPattern.join('-');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
      authPattern: authPatternString
    });
    localStorage.setItem('token', response.data.token);
    
    console.log("Welcome back,", response.data.firstName);
    navigate('/catalog');

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="signup-outer-wrapper" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw',
      backgroundColor: '#050505' 
    }}>
      <div className="page-container">
        
        <header className="page-header">
          <div className="logo-wrapper" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img 
              src={gengarLogo} 
              alt="Lavender Route Gengar Logo" 
              width="45" 
              height="45" 
              className="logo-image"
            />
            <h1 className="brand-name">
              <span className="text-lime">LAVENDER</span> <span className="text-purple">ROUTE</span>
            </h1>
          </div>
        </header>

        <main className="content-card-layout">
          
          <section className="left-image-panel">
            <div className="panel-glitch-wrapper">
              <LetterGlitch
                glitchColors={["#7C3AED", "#A855F7"]}
                glitchSpeed={50}
                centerVignette={false}
                outerVignette={false}
                smooth={true}
              />
            </div>
            <div className="panel-text">
              <h2>WELCOME BACK</h2>
              <p>Log in to access the shadowy hub</p>
            </div>
          </section>

          <section className="right-form-panel">
            <div className="form-container">
              
              <div className="form-header">
                <h2>Log In</h2>
                <p>Enter your credentials to continue</p>
              </div>
              
              <form onSubmit={handleLogin}>
                
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="trainer@pallet.town" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>

                <PokePattern pattern={tokenPattern} setPattern={setTokenPattern} />

                <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>
                  Enter Route
                </button>
                
                <div className="login-link">
                  Don't have an account?{' '}
                  <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: 'var(--lavender-purple)', textDecoration: 'underline' }}>
                    SIGN UP
                  </span>
                </div>

              </form>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default Login;