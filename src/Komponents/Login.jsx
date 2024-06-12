import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Login() {
  return (
    <div>
        <>
            <li><Link to="/registration">Registration</Link></li>

            <h1>Välkommen till Snackis</h1>  
            <h2>var god logga in</h2>
            <label htmlFor="username">Användarnamn</label>
            <input type="text" name="username" id="username" />
            <br />
            <label htmlFor="password">Lösenord</label>
            <input type="password" name="password" id="password" />
            <br />
            <button>Send</button>
          </>
      
    </div>
  )
}

export default Login
