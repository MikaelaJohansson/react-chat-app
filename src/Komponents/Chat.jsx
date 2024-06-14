import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [localStorageValue, setLocalStorageValue] = useState('');
 

  useEffect(() => {
    const localStorageItem = localStorage.getItem('user');
    if (localStorageItem) {
      setLocalStorageValue(localStorageItem);
    }
  }, []); 

  return (
    <div className="sidenav">
      <h1>Local Storage Value: {localStorageValue}</h1>
      
    </div>
  );
};

export default Chat;



















