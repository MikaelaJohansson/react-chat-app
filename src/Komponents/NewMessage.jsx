import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';

const NewMessage = ({ onMessageSent }) => {
  const [message, setMessage] = useState('');

  const sendNewMessage = () => {
    const token = sessionStorage.getItem('token');
    const conversationId = sessionStorage.getItem('id');

    if (!conversationId) {
      console.error('No conversationId provided.');
      return;
    }

    const sanitizedMessage = DOMPurify.sanitize(message);

    const messagePayload = {
      text: sanitizedMessage,
      conversationId: ''
    };

    console.log('Message being sent:', messagePayload);
    console.log('Message being sent is sanitizedMessage');

    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    axios.post('https://chatify-api.up.railway.app/messages', messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
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

    setMessage(''); // Clear the input field after sending the message
  };

  return (
    <div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Enter your message" 
      />
      <button onClick={sendNewMessage}>Send</button>
    </div>
  );
};

export default NewMessage;
















































































