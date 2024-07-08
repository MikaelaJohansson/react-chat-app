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
    const messageId = sessionStorage.getItem('messageId');

    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
      setConversationId(messageId);
    }

    fetchMessages(); // Anropa fetchMessages initialt

  }, []);

  const fetchMessages = async (messageId) => {
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
      setMessages(response.data); // Uppdatera messages-tillståndet med hämtad data
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleNewMessageSent = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]); // Lägg till det nya meddelandet till messages-tillståndet
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
      console.log('Before saving conversationId:', conversationId);
      sessionStorage.setItem('conversationId', conversationId);
      console.log('After saving conversationId:', sessionStorage.getItem('conversationId'));

      
      
    } catch (error) {
      console.error('Fel vid inbjudan av användare:', error);
      setError('Användaren hittades inte. Kontrollera användar-ID.');
    }
  };

  const handleAcceptInvite = async (conversationId) => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id'); // Antag att användar-ID lagras i session
  
    if (!token) {
      console.error('Ingen token hittades. Användaren är inte autentiserad.');
      return;
    }
  
    try {
      // Acceptera inbjudan genom att skicka en förfrågan till API:et
      const response = await axios.post(  'https://chatify-api.up.railway.app/invite/accept',
        { conversationId, userId }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
  
      console.log('Inbjudan accepterad framgångsrikt:', response.data);
  
      // Uppdatera aktuellt konversations-ID
      setConversationId(conversationId);
      fetchMessagesForConversation(conversationId); // Hämta meddelanden för den nya konversationen
  
      // Omdirigera till en ny komponent eller sida
      window.location.href = '/InviteUser';
    } catch (error) {
      console.error('Fel vid accept av inbjudan:', error);
    }
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
      {conversationId && ( // Render the button only if conversationId exists
        <button onClick={handleAcceptInvite}>Accept Invitation</button>
      )}
    </div>
  );
};

export default Chat;




































































































