import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios';

import gengarLogo from '../assets/gengar-logo.png'

import '../css/SignUp.css'
import PokePattern from '../components/PokePattern';
import LetterGlitch from '../components/LetterGlitch'
import toast from 'react-hot-toast';

//stepper imports
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Select your role', 'Enter personal details', 'Set your password'];


function SignUp() {
  const [activeStep, setActiveStep] = useState(0);


  const [role, setRole] = useState('buyer');
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('')
  const [authPattern, setAuthPattern] = useState('')
  const [adminPasskey, setAdminPasskey] = useState('')

  const navigate = useNavigate()
  const [tokenPattern, setTokenPattern] = useState([]);

  const checkAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!firstName || !lastName || !email || !dob) {
        return toast.error("Please fill in all fields.");
      }
      if (!checkAge(dob)) {
        return toast.error("You must be 18 or older to enter the Lavender Route.");
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSignUp = async (e) => {
  e.preventDefault();
  if (tokenPattern.length < 6) {
      return toast.error('Pattern must be at least 6 tokens');
    }
    const authPatternString = tokenPattern.join('-');

    let rolesArray = [];
    if (role === 'buyer') rolesArray = ['buyer'];
    if (role === 'seller') rolesArray = ['seller'];
    if (role === 'hybrid') rolesArray = ['buyer', 'seller'];
    if (role === 'admin') rolesArray = ['admin'];

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      roles: rolesArray,
      firstName,
      lastName,
      email,
      password,
      dob,
      authPattern: authPatternString,
      adminPasskey: role === 'admin' ? adminPasskey : undefined
    });

      toast.success(response.data.message || "Account created successfully!");
      navigate('/login');

    } catch (err) {
      console.log("WHY IS IT BREAKINF", err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
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
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '100vh', width: '100vw', backgroundColor: '#050505' 
    }}>
      <div className="page-container">
        
        <header className="page-header">
          <div className="logo-wrapper">
            <img src={gengarLogo} alt="Logo" width="45" height="45" className="logo-image" />
            <h1 className="brand-name">
              <span className="text-green">LAVENDER</span> <span className="text-purple">ROUTE</span>
            </h1>
          </div>
        </header>

        <main className="content-card-layout">
          <section className="left-image-panel">
            <div className="panel-glitch-wrapper">
              <LetterGlitch glitchColors={["#7C3AED", "#A855F7"]} glitchSpeed={50} smooth={true}  outerVignette={false} 
  centerVignette={false}/>
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
              <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: '30px', color: '#BA8CFF' }} >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel 
                      sx={{ 
                        '& .MuiStepLabel-label': { color: '#ba8cff' }, 
                        '& .MuiStepIcon-root.Mui-active': { color: '#4D4D4D' }, 
                        '& .MuiStepIcon-root.Mui-completed': { color: '#ba8cff' }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

             
              <form onSubmit={activeStep === steps.length - 1 ? handleSignUp : (e) => e.preventDefault()}>
              {renderStepContent(activeStep)}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  
                  {activeStep > 0 ? (
                    <button type="button" onClick={handleBack} className="back-btn" style={{ width: '45%', backgroundColor: '#4d4d4d' }}>
                      Back
                    </button>
                  ) : (
                    <div style={{ width: '45%' }}></div>

                    )}

                  {activeStep < steps.length - 1 ? (
                    <button type="button" onClick={handleNext} className="submit-btn" style={{ width: '45%' }}>
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="submit-btn" style={{ width: '45%' }}>
                      Sign Up
                    </button>
                  )}
                  
                </div>
                
                <div className="login-link" >
                  Already have an account? <a href="/login">LOG IN</a>
                </div>
              </form>

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SignUp;