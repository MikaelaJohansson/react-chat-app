import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Form, Button, Col, Row, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Sentry from '@sentry/react'; 
import '../App.css'; 
import styles from '../CSS/Profile.module.css';


const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedAvatar = sessionStorage.getItem('avatar');
    const storedEmail = sessionStorage.getItem('email');
    if (storedUsername) {
      setUsername(storedUsername);
      setEmail(storedEmail);
      setAvatarPreview(storedAvatar);
    }
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', file);

    const apiUrl = 'https://api.imgbb.com/1/upload';

    


    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Nätverksresponsen var inte okej.');
      }

      const data = await response.json();
      const imageUrl = data.data.url;

      setAvatar(imageUrl);
      setAvatarPreview(imageUrl);
      toast.success('Bild uppladdad framgångsrikt!');
    } catch (error) {
      console.error('Uppladdning misslyckades:', error);
      Sentry.captureException(error); 
      toast.error('Uppladdning misslyckades: ' + error.toString());
    }
  };

  const handleUpdate = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');

    try {
      await axios.put(`https://chatify-api.up.railway.app/user`, {
        userId: userId,
        updatedData: {
          avatar: avatar,
          email: email,
          username: username,
        },
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      sessionStorage.setItem('avatar', avatar);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('username', username);
      
      alert('Profilen uppdaterades framgångsrikt.');
      navigate('/Chat');
    } catch (error) {
      Sentry.captureException(error); 
      console.error('Fel vid uppdatering av profil:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');

    const confirmation = window.confirm('Är du säker på att du vill radera ditt konto? Denna åtgärd är permanent och kan inte ångras.');

    if (!confirmation) {
      return;
    }

    try {
      await axios.delete(`https://chatify-api.up.railway.app/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Ditt konto har raderats framgångsrikt.');
      sessionStorage.clear();
      localStorage.clear();
      navigate('/Login');
    } catch (error) {
      console.error('Fel vid radering av användarkonto.', error);
      Sentry.captureException(error); 
    }
  };

  return (
    <div className={`${styles.profilContainer} py-4`}>
    <Container className={styles.profil}>
      <h2 className="text-center mb-4">Uppdatera din Profil, {username}</h2>
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={12} md={3} >Namn</Form.Label>
          <Col sm={12} md={9}>
            <Form.Control 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={12} md={3}>E-post</Form.Label>
          <Col sm={12} md={9}>
            <Form.Control 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={12} md={3}>Avatar</Form.Label>
          <Col sm={12} md={9}>
            <Form.Control 
              type="file" 
              onChange={handleFileChange} 
            />
          </Col>
        </Form.Group>
        {avatarPreview && (
          <Form.Group as={Row} className="mb-4">
            <Col sm={{ span: 12, offset: 0 }} className="text-center">
              <Image 
                src={avatarPreview} 
                alt="Avatar Preview" 
                rounded 
                style={{ width: '150px' }} 
              />
            </Col>
          </Form.Group>
        )}
        <Form.Group as={Row} className="mb-4">
          <Col sm={{ span: 12, offset: 0 }} className="text-center">
            <Button variant="primary" onClick={handleUpdate} className="me-2">Uppdatera profil</Button>
            <Button variant="danger" onClick={handleDelete}>Radera konto</Button>
          </Col>
        </Form.Group>
      </Form>
      <div className="text-center mt-4">
        <Link to="/Chat" className={styles.link}>Tillbaka till Chat</Link>
      </div>
      <ToastContainer />
    </Container>
  </div>
  );
};

export default Profile;





































