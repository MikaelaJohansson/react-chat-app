import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Chat from './components/Chat';
import Profile from './components/Profile';
import OffCanvas from './components/OffCanvas';
import NewMessage from './components/NewMessage';
import InviteUser from './components/InviteUser';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/offcanvas" element={<OffCanvas />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/newMessage" element={<NewMessage />} />
        <Route path="/InviteUser/:id" element={<InviteUser />} />
      </Routes>
    </Router>
  );
}

export default App;







