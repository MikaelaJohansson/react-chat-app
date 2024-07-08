import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './Komponents/Registration';
import Login from './Komponents/Login';
import Chat from './Komponents/Chat';
import Profile from './Komponents/Profile';
import OffCanvas from './Komponents/OffCanvas';
import NewMessage from './Komponents/NewMessage';
import InviteUser from './Komponents/InviteUser';
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







