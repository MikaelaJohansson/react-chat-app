import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OffCanvas from './OffCanvas';
import { Container, Row, Col, Button, ListGroup, Form } from 'react-bootstrap';
import NewMessage from './NewMessage';


const Chat = () => {
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState('');
  const [invite, setInvite] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [messageText, setMessageText] = useState(''); // Bytte namn från 'message' till 'messageText'

  const [conversations, setConversations] = useState({});
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [multiMessages, setMultiMessages] = useState([]);
  const [inviteUserId, setInviteUserId] = useState('');
  const [incomingInvitations, setIncomingInvitations] = useState([]);

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

  const fetchMessages = async () => {
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
    console.log('New message received in Chat component:', newMessage);
    setMessages(prevMessages => [...prevMessages, newMessage]); // Lägg till det nya meddelandet till messages-tillståndet
  };

  useEffect(() => {
    // Denna useEffect lyssnar på förändringar i meddelandetexten
    // och skulle kunna användas för att göra någonting varje gång meddelandet ändras
    setMessages(prevMessages => [...prevMessages, NewMessage]);
    console.log('Message changed:', messageText);
    // Här kan du lägga till kod som ska köras varje gång meddelandetexten ändras
  }, [NewMessage]);

  const deleteMessage = async (messageId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    try {
      await axios.delete(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    if (currentConversationId) {
      fetchMultiMessages(currentConversationId);
    }
  }, [currentConversationId]);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchMultiMessages = async (conversationId) => {
    try {
      const response = await axios.get(`https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`);
      setMultiMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const startNewConversation = () => {
    const newConversationId = crypto.randomUUID();
    setConversations(prevConversations => ({
      ...prevConversations,
      [newConversationId]: []
    }));
    setCurrentConversationId(newConversationId);
  };

  const sendMessage = async (text) => {
    if (!currentConversationId) return;

    try {
      const response = await axios.post(`https://chatify-api.up.railway.app/messages`, {
        conversationId: currentConversationId,
        text
      });
      setMultiMessages(prevMessages => [...prevMessages, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const inviteUserToConversation = async () => {
    if (!currentConversationId || !inviteUserId) return;
  
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }
  
    try {
      await axios.post(`https://chatify-api.up.railway.app/invite/${inviteUserId}`, {
        conversationId: currentConversationId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(`User ${inviteUserId} invited to conversation ${currentConversationId}`);
    } catch (error) {
      console.error('Error inviting user:', error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized errors (e.g., redirect to login page or show error message)
      }
    }
  };
  

  const fetchInvitations = async () => {
    try {
      const response = await axios.get('https://chatify-api.up.railway.app/invites');
      setIncomingInvitations(response.data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const acceptInvitation = async (invitationId) => {
    try {
      await axios.post(`https://chatify-api.up.railway.app/invites/${invitationId}/accept`);
      fetchInvitations();
    } catch (error) {
      console.error('Error accepting invitation:', error);
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
            <button onClick={() => deleteMessage(message.id)}>Delete</button>
          </div>
        ))}
      </div>

      <Container fluid>
        <Row>
          <Col md={3} className="sidebar">
            <Button onClick={startNewConversation} className="mb-3">Start New Conversation</Button>
            <ListGroup>
              {Object.keys(conversations).map(conversationId => (
                <ListGroup.Item 
                  key={conversationId} 
                  action 
                  onClick={() => setCurrentConversationId(conversationId)}
                  active={currentConversationId === conversationId}
                >
                  Conversation {conversationId}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form.Control 
              type="text" 
              placeholder="Invite user ID" 
              value={inviteUserId} 
              onChange={(e) => setInviteUserId(e.target.value)} 
              className="mt-3"
            />
            <Button onClick={inviteUserToConversation} className="mt-2">Invite User</Button>
            <h3 className="mt-4">Incoming Invitations</h3>
            <ListGroup>
              {incomingInvitations.map(invitation => (
                <ListGroup.Item key={invitation.id}>
                  <span>Conversation {invitation.conversationId}</span>
                  <Button onClick={() => acceptInvitation(invitation.id)} className="ml-2">Accept</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={9} className="chat-window">
            {currentConversationId ? (
              <>
                <h2>Conversation {currentConversationId}</h2>
                <ListGroup>
                  {multiMessages.map(message => (
                    <ListGroup.Item key={message.id}>{message.text}</ListGroup.Item>
                  ))}
                </ListGroup>
                <Form.Control
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="mt-3"
                />
              </>
            ) : (
              <p>Select a conversation to view messages</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chat;







































































































