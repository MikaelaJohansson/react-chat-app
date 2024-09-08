import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Chat from './components/Chat';
import Profile from './components/Profile';
import OffCanvas from './components/OffCanvas';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import FriendChat from './components/FriendChat';
import NotFound from './components/NotFound';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/offcanvas" element={<OffCanvas />} />
          <Route path="/FriendChat" element={<FriendChat />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;









