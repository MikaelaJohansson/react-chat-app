import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importera axios
import DOMPurify from 'dompurify';
import styles from '../CSS/FriendChat.module.css';
import { FaTimes } from 'react-icons/fa';
import { Container, Row, Col, Button, Form, ListGroup } from 'react-bootstrap';

const FriendChat = () => {
  const location = useLocation();
  const { invite } = location.state || {}; // Få invite från state
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(''); // State för den nya meddelandetexten

  const fetchChatMessages = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in session storage.');
      return;
    }

    try {
      // Kontrollera om invite och conversationId finns
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

      // Sätt meddelandena i state
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

      const sanitizedMessage = DOMPurify.sanitize(newMessage); // Sanera input

      const response = await axios.post('https://chatify-api.up.railway.app/messages', 
      {
        text: sanitizedMessage,
        conversationId: invite.conversationId
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      // Lägg till det nya meddelandet i state
      setChatMessages(prevMessages => [...prevMessages, response.data.latestMessage]);
      setNewMessage(''); // Rensa inputfältet efter att meddelandet har skickats
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Använd useEffect för att kalla på fetchChatMessages när komponenten laddas
  useEffect(() => {
    fetchChatMessages();
  }, []);

  const formatDate = (dateString) => {
    console.log('Received date string:', dateString); // Lägg till denna rad för felsökning
    const date = new Date(dateString);
    if (date.toString() === 'Invalid Date') {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  };

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

      // Ta bort det raderade meddelandet från listan
      setChatMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
      alert('Message has been deleted');
    } catch (error) {
      console.error('Error deleting chat item:', error);
    }
  };

  return (
    <Container className={styles.FriendContainer}>
      {invite ? (
        <div>
          <h2>Chat med {invite.username || invite.conversationId}</h2>
          <ListGroup>
            {chatMessages.length > 0 ? (
              
              chatMessages.map((msg) => (
                <ListGroup.Item key={msg.id} className={styles.customListGroupItem}>
                  <Row>
                    <Col xs={10}>
                      {msg.text} <small>{formatDate(msg.createdAt)}</small> 
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
              <p>Inga medelanden </p>
            )}
          </ListGroup>
          <Form  className={styles.friendChatSend}>
            <Form.Group controlId="messageInput">
              <Form.Control
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Skriv medelanden..."
              />
            </Form.Group>
            <Button className="mt-2" onClick={sendMessage}>Skicka</Button>
          </Form>
        </div>
        
      ) : (
        <p>No invite selected</p>
      )}
      <br />
      <Link to="/Chat">Tillbaka till Chaten</Link>
    </Container>
  );
}

export default FriendChat;



