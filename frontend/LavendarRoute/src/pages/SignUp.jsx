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
    <div style={{ color: 'white' }}>
      <h2>singup</h2>
      
    </div>
    </div>
  )
}

export default SignUp