import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './Komponents/Registration';
import Login from './Komponents/Login';
import Chat from './Komponents/Chat';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoggedInUser = () => {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      try {
        const user = JSON.parse(userJson);
        if (token && user) {
          setLoggedIn(true);
          setUser(user);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setUser(null);
      }
    };

    checkLoggedInUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser(null);
    
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registration" element={<Registration />} />
        
        <Route path="/chat" element={<Chat user={user} handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;






