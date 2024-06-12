// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './Komponents/Registration'; 
import Login from './Komponents/Login';

function App() {
  return (
    <Router>     
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/registration" element={<Registration />} /> 
      </Routes>
    </Router>
  );
}

export default App;


