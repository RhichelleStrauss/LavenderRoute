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



const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="input-group">
            <label htmlFor="role" style={{ color: '#BA8CFF' }} >Select your role</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #2A1A3A', backgroundColor: '#ba8cff8a', color: '#2A1A3A' }}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="hybrid">Hybrid (Buyer & Seller)</option>
            </select>
          </div>
        );
        case 1:
          return (
          <>
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
            
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="trainer@pallet.town" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
              <label htmlFor="dob">Date of Birth (Must be 18+)</label>
              <input 
                type="date" 
                id="dob" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                style={{ colorScheme: 'dark' }}

                />
            </div>
          </>
        );

      case 2:

      return (
          <>
          {role === 'admin' && (
              <div className="input-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="adminPasskey" style={{ color: '#BA8CFF' }}>Secret Admin Passkey</label>
                <input 
                  type="password" 
                  id="adminPasskey" 
                  placeholder="admin passkey" 
                  value={adminPasskey} 
                  onChange={(e) => setAdminPasskey(e.target.value)} 
                  style={{ border: '1px solid #BA8CFF' }}
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <PokePattern pattern={tokenPattern} setPattern={setTokenPattern} />
          </>
        );
      default:
        return 'Unknown step';
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