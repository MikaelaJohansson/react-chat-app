import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OffCanvas from './OffCanvas';
import FriendChat from './FriendChat';
import NewMessage from './NewMessage';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import styles from '../CSS/Chat.module.css';

const Chat = ({ authToken, currentUserId }) => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [conversations, setConversations] = useState({});
  const [userId, setUserId] = useState('');
  const [inviteList, setInviteList] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

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
    loadInvitationsFromLocalStorage();
  }, [messages, conversations]);

  const fetchMessages = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

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
      const token = sessionStorage.getItem('token');

      try {
        const response = await axios.post(`https://chatify-api.up.railway.app/invite/${userId}`, {
          conversationId: cryptoId,
          username: user
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const newInvite = { username: userId, conversationId: cryptoId };
        localStorage.setItem(`invite-${cryptoId}`, JSON.stringify(newInvite));

        setInviteList(prevList => [
          ...prevList,
          newInvite,
          { username: user, conversationId: cryptoId }
        ]);

        setUserId('');
      } catch (error) {
        console.error('Error sending invitation:', error);
      }
    } else {
      alert('Please enter a valid user ID.');
    }
  };

  const loadInvitationsFromLocalStorage = () => {
    const keys = Object.keys(localStorage);
    const invites = keys
      .filter(key => key.startsWith('invite-'))
      .map(key => JSON.parse(localStorage.getItem(key)));

    setInviteList(invites);
  };

  const retrieveInvitations = () => {
    const jwtToken = sessionStorage.getItem('token');

    if (!jwtToken) {
      console.error('No token found in session storage.');
      return;
    }

    try {
      const decodedToken = jwtDecode(jwtToken);
      const inviteString = decodedToken.invite || "[]";
      const invites = JSON.parse(inviteString);
      setReceivedInvites(Array.isArray(invites) ? invites : []);
    } catch (error) {
      console.error('Error decoding JWT or parsing invites:', error);
    }
  };

  const handleInviteSelect = (invite) => {
    setSelectedInvite(invite);
    navigate('/FriendChat', { state: { invite } });
  };

  const handleInvitationSelect = (invite) => {
    setSelectedInvitation(invite);
    localStorage.setItem('selectedInvitation', JSON.stringify(invite));
    navigate('/FriendChat', { state: { invite } });
  };

  return (
    <Container className={styles.cont}>
      <Row>
        <Col md={4}>
          <h1>Hej {user} Välkommen tillbaka</h1>
          <OffCanvas user={user} avatar={avatar} />
          <NewMessage onMessageSent={handleNewMessageSent} />

          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <p>{message.text}</p>
                <Button variant="link" onClick={() => deleteMessage(message.id)}>
                  <FaTimes />
                </Button>
              </div>
            ))}
          </div>
        </Col>

        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ange användar ID"
            />
            <Button onClick={handleInvite}>Bjud in vän</Button>
          </Form.Group>

          <div>
            <h2>Dina inbjudningar</h2>
            <ul>
              {Array.isArray(inviteList) && inviteList.length > 0 ? (
                inviteList.map((invite, index) => (
                  <li key={index}>
                    <Button variant="link" onClick={() => handleInviteSelect(invite)}>
                      {invite.username || invite.conversationId}
                    </Button>
                  </li>
                ))
              ) : (
                <p>Inga inbjudningar tillgängliga</p>
              )}
            </ul>
          </div>

          {selectedInvite && (
            <div>
              <h2>Skicka ett medelande till {selectedInvite.username || selectedInvite.conversationId}</h2>
              <Form.Control
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Skriv medelande..."
              />
              <Button onClick={sendMessageToInvite}>Skicka</Button>
            </div>
          )}

          <div>
            <Button onClick={retrieveInvitations}>Hämta inbjudan från vänner</Button>
            <ul>
              {Array.isArray(receivedInvites) && receivedInvites.length > 0 ? (
                receivedInvites.map((invitation, idx) => (
                  <li key={idx}>
                    <Button variant="link" onClick={() => handleInvitationSelect(invitation)}>
                      {invitation.username || invitation.convoId}
                    </Button>
                  </li>
                ))
              ) : (
                <p>Inga inbjudningar tillgängliga</p>
              )}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;













































































































