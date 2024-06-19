import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './Komponents/Registration';
import Login from './Komponents/Login';
import Chat from './Komponents/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offcanvas } from 'react-bootstrap';



function App() {
  
  



  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path='/Offcanvas' element={<Offcanvas/>}/>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;






