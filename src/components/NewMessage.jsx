import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';
import styles from '../CSS/NewMessage.module.css';
import * as Sentry from "@sentry/react";

const NewMessage = ({ onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [messageId, setMessageId] = useState('');

  const sendNewMessage = () => {
    const token = sessionStorage.getItem('token');

    const messageId = crypto.randomUUID();
    setMessageId(messageId);

    if (!messageId) {
      Sentry.captureMessage('No conversationId provided.', 'error');
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
      Sentry.captureMessage('No token found. User is not authenticated.', 'error');
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
      onMessageSent(response.data); 
    })
    .catch(error => {
      Sentry.captureMessage('Error sending message', 'error');
      console.error('Error sending message:', error);
    });

    sessionStorage.setItem(messageId, messageId);
    setMessage(''); 
  };

  return (
    <section className={styles.NewMessage}>
      <h2>Skriv ett inlägg</h2>
      <div>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Skriv medelande" 
        />
        <br />
        <br />
        <button className={styles.NewMessageButton} onClick={sendNewMessage}>Skicka</button>
      </div>
    </section>
  );
};

export default NewMessage;




















































































