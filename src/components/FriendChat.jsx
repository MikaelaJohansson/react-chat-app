import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import DOMPurify from 'dompurify';
import styles from '../CSS/FriendChat.module.css';
import { FaTimes } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, ListGroup } from 'react-bootstrap';
import '../App.css'; 
import * as Sentry from '@sentry/react'; 

const FriendChat = () => {
  const location = useLocation();
  const { invite } = location.state || {}; 
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(''); 

  const fetchChatMessages = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in session storage.');
      return;
    }

    try {
      
      if (!invite || !invite.conversationId) {
        console.error('No invite or conversationId available.');
        return;
      }

      const response = await axios.get('https://chatify-api.up.railway.app/messages', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          conversationId: invite.conversationId
        }
      });

    
      setChatMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const sendMessage = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in session storage.');
      return;
    }

    try {
      if (!invite || !invite.conversationId) {
        console.error('No invite or conversationId available.');
        return;
      }
      
      console.log('Original message:', newMessage); 

      const sanitizedMessage = DOMPurify.sanitize(newMessage); 

      console.log('Sanitized message:', sanitizedMessage);

      const response = await axios.post('https://chatify-api.up.railway.app/messages', 
      {
        text: sanitizedMessage,
        conversationId: invite.conversationId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      console.info('Message sent successfully:', response.data);
      console.log(response.data)
      setChatMessages(prevMessages => [...prevMessages, response.data.latestMessage]);
      setNewMessage(''); 
    } catch (error) {
      Sentry.captureMessage('Error sending message:', 'error');
      console.error('Error sending message:', error);
    }
  };

  
  useEffect(() => {
    fetchChatMessages();
  }, []);

  const deleteChatItem = async (msgId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in session storage.');
      return;
    }

    try {
      await axios.delete(`https://chatify-api.up.railway.app/messages/${msgId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      setChatMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
      alert('Message has been deleted');
    } catch (error) {
      console.error('Error deleting chat item:', error);
      Sentry.captureMessage('Error deleting chat item:', 'error');
    }
  };

  return (
    <Container className={`${styles.FriendContainer} my-4`}>
      {invite ? (
        <div>
          <h2 className="text-center mb-4">Chat med {invite.username || invite.conversationId}</h2>
          <ListGroup className="mb-4">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <ListGroup.Item key={`${msg.id}-${index}`} className={`${styles.customListGroupItem} mb-2`}>
                  <Row className="align-items-center">
                    <Col xs={10}>
                      {msg.text}
                    </Col>
                    <Col xs={2} className="text-end">
                      <Button variant="danger" size="sm" onClick={() => deleteChatItem(msg.id)}>
                        <FaTimes />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-center">Inga meddelanden</p>
            )}
          </ListGroup>
          <Form className={styles.friendChatSend}>
            <Form.Group controlId="messageInput">
              <Form.Control
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Skriv meddelanden..."
                className="form-control-"
              />
            </Form.Group>
            <Button className="mt-3 " onClick={sendMessage}>
              Skicka
            </Button>
          </Form>
        </div>
      ) : (
        <p className="text-center">No invite selected</p>
      )}
      <div className="text-center mt-4">
        <Link to="/Chat">Tillbaka till Chat</Link>
      </div>
    </Container>
  );
}

export default FriendChat;



