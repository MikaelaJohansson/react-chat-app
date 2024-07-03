import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OffCanvas from './OffCanvas';
import NewMessage from './NewMessage';


const Chat = () => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [invite, setInvite] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const avatarFromSessionStorage = sessionStorage.getItem('avatar');
    const conversationIdFromSessionStorage = sessionStorage.getItem('id');

    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
      setConversationId(conversationIdFromSessionStorage);
    }

    fetchMessages(); // Call fetchMessages initially

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

  useEffect(() => {
    // Denna useEffect lyssnar på förändringar i meddelandetexten
    // och skulle kunna användas för att göra någonting varje gång meddelandet ändras
    console.log('Message changed:', message);
    // Här kan du lägga till kod som ska köras varje gång meddelandetexten ändras
  }, [message]);




  //  hantera inbjudan i komponent
  const handleInvite = async () => {
    const token = sessionStorage.getItem('token');
    const userId = invite;

    if (!token) {
      console.error('Ingen token hittades. Användaren är inte autentiserad.');
      return;
    }

    try {
      const conversationId = crypto.randomUUID();
      setConversationId(conversationId);

      const inviteResponse = await axios.post(`https://chatify-api.up.railway.app/invite/${userId}`, {
        conversationId: conversationId
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Inbjudan skickad framgångsrikt:', inviteResponse.data);
      console.log(conversationId)
      
      
    } catch (error) {
      console.error('Fel vid inbjudan av användare:', error);
      setError('Användaren hittades inte. Kontrollera användar-ID.');
    }
  };

  const handleAcceptInvite = () => {
    
    window.location.href =(`/InviteUser/${conversationId}`);
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
          </div>
        ))}
      </div>
      <div className='invite'>
      <input 
        type="text" 
        value={invite} 
        onChange={(e) => setInvite(e.target.value)} 
        placeholder="invite" 
      />
      <button onClick={handleInvite}>Invite</button>
      </div>
      <button onClick={handleAcceptInvite}>Acceptera inbjudan</button>
    </div>
  );
};

export default Chat;




































































































