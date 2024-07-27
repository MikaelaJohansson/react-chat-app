import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OffCanvas from './OffCanvas';
import FriendChat from './FriendChat';
import NewMessage from './NewMessage';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Chat = ({ authToken, currentUserId }) => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [conversations, setConversations] = useState({});
  const [userId, setUserId] = useState(''); 
 
  const [inviteList, setInviteList] = useState([]);
  
  const navigate = useNavigate();
 
  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const avatarFromSessionStorage = sessionStorage.getItem('avatar');
    const messageId = sessionStorage.getItem('messageId');

    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
      setConversationId(messageId);
    }
    fetchMessages();
  }, [messages,conversations]);

  const fetchMessages = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const id=sessionStorage.getItem('user')

    try {
      const response = await axios.get('https://chatify-api.up.railway.app/messages', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        
       
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleNewMessageSent = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const deleteMessage = async (messageId) => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleInvite = async () => {
    if (userId.trim()) {
      const cryptoId = crypto.randomUUID();
      

      const token = sessionStorage.getItem('token'); // Ensure token is available
     
      try {
        const response = await axios.post(`https://chatify-api.up.railway.app/invite/${userId}`, {
          conversationId: cryptoId
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Invitation sent successfully:', response.data);
        console.log(cryptoId,userId);
      } catch (error) {
        console.error('Error sending invitation:', error);
      }
    } else {
      alert('Please enter a valid user ID.');
    }
  };


  
    





  
  const fetchInvitations = () => {
    const jwtToken = sessionStorage.getItem('token');

    if (!jwtToken) {
      console.error('No token found in session storage.');
      return;
    }

    try {
      const decodedToken = jwtDecode(jwtToken);
      console.log('Decoded Token:', decodedToken);

      const inviteString = decodedToken.invite || "[]";
      const invites = JSON.parse(inviteString);
      console.log('Parsed Invites:', invites);

      setInviteList(Array.isArray(invites) ? invites : []);
    } catch (error) {
      console.error('Error decoding JWT or parsing invites:', error);
    }
  };
   

  // Function to handle invite selection
  const handleInviteSelect = (invite) => {
    
    navigate('/FriendChat', { state: { invite } });
  };

  // // Function to start a conversation
  // const startConversation = async (cryptoId) => {
  //   const token = sessionStorage.getItem('token');
  //   try {
  //     const response = await axios.post('https://chatify-api.up.railway.app/messages', {
  //       text: 'Starting a conversation',
  //       conversationId: cryptoId,
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log('Conversation started:', response.data);
  //   } catch (error) {
  //     console.error('Error starting conversation:', error);
  //   }
  // };
  
  
  return (
    <div className="sidenav">
      <h1>Hello {user}</h1>
      <OffCanvas user={user} avatar={avatar} />
      <NewMessage onMessageSent={handleNewMessageSent} />

      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <p>{message.text}</p>
            <button onClick={() => deleteMessage(message.id)}>Delete</button>
          </div>
        ))}
      </div>
        <div>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
        />
        <button onClick={handleInvite}>Bjud in vän</button>
      </div>





      <div>
        <button onClick={fetchInvitations}>Fetch Invites</button>
        <ul>
          {Array.isArray(inviteList) && inviteList.length > 0 ? (
            inviteList.map((invite, index) => (
              <li key={index}>
                <button onClick={() => handleInviteSelect(invite)}>
                  {invite.username || invite.conversationId}
                </button>
              </li>
            ))
          ) : (
            <p>No invites available</p>
          )}
        </ul>
     </div>
     
    </div>
  );
};

export default Chat;











































































































