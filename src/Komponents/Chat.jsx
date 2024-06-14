import React, { useState, useEffect } from 'react';

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
      <h1>Session Storage Value: {user}</h1>
      <img src={avatar} alt="Avatar" />
    </div>
  );
};

export default Chat;





















