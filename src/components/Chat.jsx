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
  const [conversations, setConversations] = useState({});
  const [userId, setUserId] = useState('');
  const [inviteList, setInviteList] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
  }, [conversations]);
  
    const onUserPost = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token saknas i sessionStorage');
        Sentry.captureMessage('Token saknas i sessionStorage', 'error');
        return;
    }

    const sanitizedUserPost = DOMPurify.sanitize(userPost);

    axios.post('https://chatify-api.up.railway.app/messages', {
        text: sanitizedUserPost,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.info('Meddelande mottaget:', response.data);
        setUserPost('');
        fetchMessages();
    })
    .catch(error => {
        console.error('Meddelande ej mottaget:', error);
        Sentry.captureMessage('Fel vid postning av meddelande: ' + error.message, 'error');
    });
  };

  const fetchMessages = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Token saknas i sessionStorage');
        Sentry.captureMessage('Token saknas i sessionStorage', 'error');
        return;
    }

    axios.get('https://chatify-api.up.railway.app/messages', {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.info('Användarens post hämtade:', response.data);
        setMessages(response.data);
    })
    .catch(error => {
        console.error('Fel vid hämtning av user posts:', error);
        Sentry.captureMessage('Fel vid hämtning av meddelanden: ' + error.message, 'error');
    });
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

        console.log('Invitation sent successfully:', response.data);
        console.log(cryptoId,userId);
       
        const newInvite = { username: userId, conversationId: cryptoId,sentBy: loggedInUserId };
        localStorage.setItem(`invite-${cryptoId}`, JSON.stringify(newInvite));

        setInviteList(prevList => [
          ...prevList,
          newInvite,
        ]);

        setUserId('');

        console.info('Invitation sent successfully:', response.data);
       
      } catch (error) {
        console.error('Error sending invitation:', error);
        Sentry.captureMessage('Error sending invitation', 'error');
      }
    } else {
      alert('Please enter a valid user ID.');
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
      console.error('No token found in session storage.');
      return;
    }

    try {
      const decodedToken = jwtDecode(jwtToken);
      const inviteString = decodedToken.invite || "[]";
      const invites = JSON.parse(inviteString);
      setReceivedInvites(Array.isArray(invites) ? invites : []);
      console.log('Retrieved invitations:', invites);
    } catch (error) {
      Sentry.captureMessage('Error decoding JWT or parsing invites', 'error');
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
    navigate('/FriendChat', { state: { invite} });
  };

  return (
    <Container className={styles.container}>
      
      <header className={styles.header}>
        <h1 className={styles.headerH1}>Hej {user}!</h1>
        <br />
        <img className={styles.headerImg} src={avatar} alt="User Avatar"   />    
        <OffCanvas user={user} avatar={avatar} />
      </header>

      <Row>
        <Col md={4}>
          <div  className={styles.messages}>
            <label>Skriv ett inlägg:</label>
            <br />
            <input
              type="text"
              value={userPost}
              onChange={(e) => setUserPost(e.target.value)}
            />
            <br />
            <button  className={styles.button} type='button' variant="primary"  onClick={onUserPost}>Skicka in</button>

            <br />
            <div>
              <h3>Meddelanden:</h3>
              {messages.length > 0 ? (
                    <ul>
                    {messages.map((message, index) => (
                      <li key={index}  className={styles.messagesChat} >
                        {message.text} 
                        <FaTimes 
                          style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }} 
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

      
        <Col md={8}>
          <div className={styles.invites}>  
            <h2>Starta chat med vän</h2>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Ange användar ID"
              />
              <br />
              <Button onClick={handleInvite}>Bjud in vän</Button>
            </Form.Group>       
            <h2>Dina chatar</h2>
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

          <div className={styles.invites}>
            <h2>Hämta inbjudan från</h2>
            <Button onClick={retrieveInvitations}>Hämta</Button>
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













































































































