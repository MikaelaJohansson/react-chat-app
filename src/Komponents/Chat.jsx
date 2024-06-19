import React, { useState, useEffect } from 'react';
import Offcanvas from './Offcanvas';


const Chat = () => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const avatarFromSessionStorage = sessionStorage.getItem('avatar');
    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
    }
  }, []);

  return (
    <div className="sidenav">
      <h1>Hej {user} kul att se dig igen</h1>
      <img src={avatar} alt="Avatar" />
      <br />
      <Offcanvas user={user} avatar={avatar}/>
    </div>
  );
};

export default Chat;





















