import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OffCanvas from './OffCanvas';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import styles from '../CSS/Chat.module.css';
import * as Sentry from '@sentry/react'; 
import '../App.css'; 
import DOMPurify from 'dompurify';

const Chat = () => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [userId, setUserId] = useState('');
  const [inviteList, setInviteList] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [userPost, setUserPost] = useState('');
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem('username');
    const avatarFromSessionStorage = sessionStorage.getItem('avatar');
    const messageId = sessionStorage.getItem('messageId');

    if (userFromSessionStorage && avatarFromSessionStorage) {
      setUser(userFromSessionStorage);
      setAvatar(avatarFromSessionStorage);
      setConversationId(messageId);
    }
    
    fetchMessages();
    loadInvitationsFromLocalStorage();
  }, []);
  
  const onUserPost = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token saknas i sessionStorage');
      Sentry.captureMessage('Token saknas i sessionStorage', 'error');
      return;
    }

    const sanitizedUserPost = DOMPurify.sanitize(userPost);

    try {
      const response = await axios.post('https://chatify-api.up.railway.app/messages', {
        text: sanitizedUserPost,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.info('Meddelande mottaget:', response.data);
      setUserPost('');
      await fetchMessages(); 
    } catch (error) {
    console.error('Meddelande ej mottaget:', error);
    Sentry.captureMessage('Fel vid postning av meddelande: ' + error.message, 'error');
  }
  };


  const fetchMessages = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token saknas i sessionStorage');
      Sentry.captureMessage('Token saknas i sessionStorage', 'error');
      return;
    }

    try {
      const response = await axios.get('https://chatify-api.up.railway.app/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.info('Användarens meddelanden hämtade:', response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Fel vid hämtning av meddelanden:', error);
      Sentry.captureMessage('Fel vid hämtning av meddelanden: ' + error.message, 'error');
    }
  };

  const deleteMessage = (id) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token saknas i sessionStorage');
      Sentry.captureMessage('Token saknas i sessionStorage', 'error');
      return;
    }

    axios.delete(`https://chatify-api.up.railway.app/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.info('Meddelande raderat:', response.data);
      fetchMessages();
    })
    .catch(error => {
      console.error('Kunde ej radera meddelande:', error);
      Sentry.captureMessage('Fel vid radering av meddelande: ' + error.message, 'error');
    });
  };


  const handleInvite = async () => {
    if (userId.trim()) {
      const cryptoId = crypto.randomUUID();
      const username = user;
      const token = sessionStorage.getItem('token'); 
      const loggedInUserId = sessionStorage.getItem('username');
     
      try {
        const response = await axios.post(`https://chatify-api.up.railway.app/invite/${userId}`, {
          conversationId: cryptoId,
          username: username 
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Inbjudan skickades framgångsrikt:', response.data);
        console.log(cryptoId,userId);
       
        const newInvite = { username: userId, conversationId: cryptoId,sentBy: loggedInUserId };
        localStorage.setItem(`invite-${cryptoId}`, JSON.stringify(newInvite));

        setInviteList(prevList => [
          ...prevList,
          newInvite,
        ]);

        setUserId('');

        console.info('Inbjudan skickad framgångsrikt:', response.data);
       
      } catch (error) {
        console.error('Fel vid sändning av inbjudan:', error);
        Sentry.captureMessage('Fel vid sändning av inbjudan.', 'error');
      }
    } else {
      alert('Ange ett giltigt användar-ID.');
    }
  };


  const loadInvitationsFromLocalStorage = () => {
    const keys = Object.keys(localStorage);
    const loggedInUserId = sessionStorage.getItem('username'); 

    const invites = keys
    .filter(key => key.startsWith('invite-'))
    .map(key => JSON.parse(localStorage.getItem(key)))
    .filter(invite => invite.sentBy === loggedInUserId);

    setInviteList(invites);
  };


  const retrieveInvitations = () => {
    const jwtToken = sessionStorage.getItem('token');
  
    if (!jwtToken) {
      console.error('Ingen token hittades i sessionslagringen.');
      return;
    }
  
    try {
      const decodedToken = jwtDecode(jwtToken);
      const inviteString = decodedToken.invite || "[]";
      const invites = JSON.parse(inviteString);
  
      const uniqueInvites = invites.reduce((acc, current) => {
        const exists = acc.find(item => item.username === current.username);
        
        if (!exists) {
          acc.push(current);
        }
  
        return acc;
      }, []);
  
      setReceivedInvites(Array.isArray(uniqueInvites) ? uniqueInvites : []);
      console.log('Hämtade inbjudningar:', uniqueInvites);
    } catch (error) {
      Sentry.captureMessage('Fel vid avkodning av JWT eller vid tolkning av inbjudningar.', 'error');
      console.error('Fel vid avkodning av JWT eller vid bearbetning av inbjudningar:', error);
    }
  };
  

  const handleInviteSelect = (invite) => {
    setSelectedInvite(invite);
    navigate('/FriendChat', { state: { invite } });
  };

  const handleInvitationSelect = (invite) => {
    setSelectedInvitation(invite);
    localStorage.setItem('selectedInvitation', JSON.stringify(invite));
    navigate('/FriendChat', { state: { invite} });
  };

  return (
    <Container fluid >
      <header className={styles.header}>
        <h1 className={`${styles.headerH1} text-center`}>Hej {user}!</h1>
        <div className="text-center my-3">
          <img className={`${styles.headerImg} img-fluid`}  src={avatar} alt="User Avatar" />
        </div>
        <OffCanvas user={user} avatar={avatar} />
      </header>
      <Row className={styles.container}>
        <Col xs={12} md={4} className="mb-4">
          <div className={styles.messages}>
            <label htmlFor="userPost">Skriv ett inlägg:</label>
            <input
              id="userPost"
              className="form-control my-2"
              type="text"
              value={userPost}
              onChange={(e) => setUserPost(e.target.value)}
            />
            <Button  className={styles.chatButton1}  variant="primary" onClick={onUserPost}>
              Skicka in
            </Button>
            <div className="mt-4">
              <h3>Meddelanden:</h3>
              {messages.length > 0 ? (
                <ul className="list-unstyled">
                  {messages.map((message, index) => (
                    <li key={index} className={`${styles.messagesChat} d-flex align-items-center`}>
                      {message.text}
                      <FaTimes
                        className="ms-2 text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => deleteMessage(message.id)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Inga meddelanden att visa</p>
              )}
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className={styles.invites}>
            <h2>Starta chat med vän</h2>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Ange användar ID"
              />
              <Button  className={styles.chatButton} onClick={handleInvite}>
                Bjud in vän
              </Button>
            </Form.Group>
            <h2>Dina chattar</h2>
            <ul className="list-unstyled">
              {Array.isArray(inviteList) && inviteList.length > 0 ? (
                inviteList.map((invite, index) => (
                  <li key={index}>
                    <Button variant="link" className="p-0" onClick={() => handleInviteSelect(invite)}>
                      {invite.username || invite.conversationId}
                    </Button>
                  </li>
                ))
              ) : (
                <p>Inga inbjudningar tillgängliga</p>
              )}
            </ul>
          </div>
          <div className={`${styles.invites} mt-4`}>
            <h2>Hämta inbjudan från</h2>
            <Button  className={styles.chatButton}  onClick={retrieveInvitations}>
              Hämta
            </Button>
            <ul className="list-unstyled mt-3">
              {Array.isArray(receivedInvites) && receivedInvites.length > 0 ? (
                receivedInvites.map((invitation, idx) => (
                  <li key={idx}>
                    <Button variant="link" className="p-0" onClick={() => handleInvitationSelect(invitation)}>
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













































































































