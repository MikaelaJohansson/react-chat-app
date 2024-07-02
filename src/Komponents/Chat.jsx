import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OffCanvas from './OffCanvas';
import NewMessage from './NewMessage';

const Chat = () => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');

  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const avatarFromSessionStorage = sessionStorage.getItem('avatar');
    const conversationIdFromSessionStorage = sessionStorage.getItem('conversationId');

    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
      setConversationId(conversationIdFromSessionStorage);
    }

    fetchMessages(); // Call fetchMessages initially

    const interval = setInterval(fetchMessages, 5000); // Polling every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const fetchMessages = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }
    try {
      const response = await axios.get('https://chatify-api.up.railway.app/messages', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setMessages(response.data); // Update messages state with fetched data
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleNewMessageSent = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]); // Append new message to messages state
  };

  return (
    <div className="sidenav">
      <h1>Hello {user}</h1>
      <OffCanvas user={user} avatar={avatar} />
      <NewMessage onMessageSent={handleNewMessageSent} />
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <p>{message.text}</p>
            <span>{message.sender}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;



































































































