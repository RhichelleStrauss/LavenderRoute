import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import gengarLogo from '../assets/gengar-logo.png' 

import '../css/SignUp.css' 

import LetterGlitch from '../components/LetterGlitch' 

function SignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [specialCode, setSpecialCode] = useState('')

  const navigate = useNavigate()

  const handleSignUp = (e) => {
    e.preventDefault()
    navigate('/') 
  }

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
        <div className="logo-wrapper">
          <img 
            src={gengarLogo} 
            alt="Lavender Route Gengar Logo" 
            width="45" 
            height="45" 
            className="logo-image"
          />
          <h1 className="brand-name">
            <span className="text-green">LAVENDER</span> <span className="text-purple">ROUTE</span>
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
            <h2>LAVENDER ROUTE</h2>
            <p>Get started with us</p>
          </div>
        </section>

        <section className="right-form-panel">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Please enter your details to create an account</p>
            </div>
            
            <form onSubmit={handleSignUp}>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" placeholder="e.g. Ash" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" placeholder="e.g. Ketchum" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              
              <div className="note-text">
                *publicly your username will be the first letter of your name
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="trainer@pallet.town" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="input-group">
                <label htmlFor="specialCode">Insert your own special code </label>
                <input type="text" id="specialCode" placeholder="Enter auth code" value={specialCode} onChange={(e) => setSpecialCode(e.target.value)} />
              </div>

              <button type="submit" className="submit-btn">Sign Up</button>
              
              <div className="login-link">
                Already have an account? <a href="/login">LOG IN</a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
    </div>
  )
}

export default SignUp