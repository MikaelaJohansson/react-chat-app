import React, { useState } from 'react';
import DOMPurify from 'dompurify';


const NewMessage = ({ onMessageSent, conversationId }) => {
  const [message, setMessage] = useState('');

  const sendNewMessage = () => {
    const sanitizedMessage = DOMPurify.sanitize(message);

    const messagePayload = {
      text: sanitizedMessage,
      conversationId: conversationId, // Ensure conversationId is set correctly
      userId: getUserIdFromToken() // Assuming you have a function to get userId from JWT token
    };

    console.log('Message being sent:', messagePayload); // Log the message being sent

    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    fetch('https://chatify-api.up.railway.app/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(messagePayload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create message');
      }
      return response.json();
    })
    .then(data => {
      console.log('Message created successfully:', data);
      setMessage(''); // Clear the input field after sending the message
      onMessageSent(); // Call function passed from Chat component to update messages
    })
    .catch(error => console.error('Error sending message:', error));
  };

  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub; // Assuming 'sub' contains the user ID
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
    return null;
  };

  return (
    <div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Skriv ditt meddelande" 
      />
      <button onClick={sendNewMessage}>Skicka</button> {/* Call sendNewMessage function on button click */}
    </div>
  );
};

export default NewMessage;


















