import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';

const NewMessage = ({ onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [messageId, setMessageId] = useState('');

  const sendNewMessage = () => {
    const token = sessionStorage.getItem('token');
    
    const messageId = crypto.randomUUID();
    setMessageId(messageId);

    if (!messageId) {
      console.error('No conversationId provided.');
      return;
    }

    const sanitizedMessage = DOMPurify.sanitize(message);

    const messagePayload = {
      text: sanitizedMessage,
      conversationId: messageId 
    };

    console.log('Message being sent:', messagePayload);

    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    axios.post('https://chatify-api.up.railway.app/messages', messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`, // Correct syntax for injecting token
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Message created successfully:', response.data);
      onMessageSent(response.data); // Pass the newly created message back to the parent component
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });

    sessionStorage.setItem(messageId, messageId);
    setMessage(''); // Clear the input field after sending the message
  };

  return (
    <div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Skriv medelande" 
      />
      <button onClick={sendNewMessage}>Skicka</button>
    </div>
  );
};

export default NewMessage;



















































































