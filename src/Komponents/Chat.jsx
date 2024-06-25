import React, { useState, useEffect } from 'react';
import OffCanvas from './OffCanvas';
import NewMessage from './NewMessage';
import { jwtDecode } from "jwt-decode";

const Chat = () => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem('user');
    const avatarFromSessionStorage = sessionStorage.getItem('avatar');
    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
    }
    fetchMessages();
    fetchUserMessages(); // Initial fetch of user-specific messages
  }, []);

  useEffect(() => {
    // This effect will trigger whenever allMessages array updates
    // or when the component mounts initially
    fetchMessages();
  }, [allMessages]); // Dependency array ensures it runs when allMessages changes

  useEffect(() => {
    // This effect will trigger whenever userMessages array updates
    // or when the component mounts initially
    fetchUserMessages();
  }, [userMessages]); // Dependency array ensures it runs when userMessages changes

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
      setAllMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMessages = async () => {
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
        throw new Error('Failed to fetch user messages');
      }
      const data = await response.json();
      const userId = jwtDecode(token).sub; // Using jwt-decode to decode JWT token
      const userSpecificMessages = data.filter(message => message.userId === userId);
      setUserMessages(userSpecificMessages);
    } catch (error) {
      console.error('Error fetching user messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllUserMessages = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }
    try {
      const deletePromises = allMessages.map(async (message) => {
        const response = await fetch(`https://chatify-api.up.railway.app/messages/${message.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to delete message with ID ${message.id}`);
        }
      });
      await Promise.all(deletePromises);
      setUserMessages([]);
      console.log('All user messages deleted successfully.');
    } catch (error) {
      console.error('Error deleting user messages:', error);
    }
  };

  const handleNewMessageSent = async (newMessage) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }
    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newMessage)
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const responseData = await response.json();
      console.log('Message created successfully:', responseData);
      // Trigger fetch of user-specific messages after sending new message
      fetchUserMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="sidenav">
      <h1>Hej {user}, kul att se dig igen</h1>
      
      <br />
      <OffCanvas user={user} avatar={avatar} />
      <NewMessage onMessageSent={handleNewMessageSent} /> {/* Pass function to handle message sent */}
      <div className="messages-section">
        <h2>Alla Meddelanden</h2>
        {loading ? (
          <p>Laddar...</p>
        ) : allMessages.length === 0 ? (
          <p>Tom inkorg</p>
        ) : (
          <ul>
            {allMessages.map((message) => (
              <li key={message.id}>{message.text}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="user-messages-section">
        <h2>Dina Meddelanden</h2>
        {loading ? (
          <p>Laddar...</p>
        ) : userMessages.length === 0 ? (
          <p>Tom inkorg</p>
        ) : (
          <ul>
            {userMessages.map((message) => (
              <li key={message.id}>{message.text}</li>
            ))}
          </ul>
        )}
        <button onClick={deleteAllUserMessages}>Radera Dina Meddelanden</button>
      </div>
    </div>
  );
};

export default Chat;





































