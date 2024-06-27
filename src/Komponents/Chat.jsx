import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OffCanvas from './OffCanvas';
import NewMessage from './NewMessage';
import InviteUser from './InviteUser';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

const Chat = () => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const avatarFromSessionStorage = sessionStorage.getItem('avatar');
    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
    }

    const fetchMessages = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No token found. User is not authenticated.');
        return;
      }
      try {
        const response = await fetch('https://chatify-api.up.railway.app/messages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  }, []);

 
  const handleNewMessageSent = () => {
    const fetchMessages = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No token found. User is not authenticated.');
        return;
      }
      try {
        const response = await fetch('https://chatify-api.up.railway.app/messages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  };

  // Chat.jsx
  const handleInviteUser = async (invitedUser) => {
    const token = sessionStorage.getItem('token');
  
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }
      try {
      const conversationId = uuidv4(); // Generera ett unikt konversations-ID
      const userId = sessionStorage.getItem('id');
      
      // Skicka inbjudan till användaren med invitedUser.id
      const response = await axios.post(`https://chatify-api.up.railway.app/invite/${invitedUser.userId}`, {
        conversationId: conversationId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Inbjudan skickad framgångsrikt:', response.data.message);

      // Uppdatera aktuellt konversations-ID
      setCurrentConversationId(conversationId); // Uppdatera aktuellt konversations-ID
      fetchMessagesForConversation(conversationId); // Hämta meddelanden för den nya konversationen

    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  

  return (
    <div className="sidenav">
      <h1>Hej {user}</h1>
      <OffCanvas user={user} avatar={avatar} />
      <NewMessage onMessageSent={handleNewMessageSent} /> 
      <InviteUser onInvite={handleInviteUser} />
      <Link to="/inviteUser">Gå till inbjuden användare</Link>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <p>{message.text}</p>
            <span>{message.sender}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;









































