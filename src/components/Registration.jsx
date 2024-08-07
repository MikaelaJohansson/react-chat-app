import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../CSS/Registration.module.css';
import Button from 'react-bootstrap/Button';
import * as Sentry from "@sentry/react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';


const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    axios.patch('https://chatify-api.up.railway.app/csrf')
      .then(response => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch(error => {
        Sentry.captureException(error);
        console.error(`Fel vid hämtning av CSRF-token: User ${user}`, error);
      });
  }, []);

  const handleRegistration = async () => {
    try {
      const response = await axios.post(
        'https://chatify-api.up.railway.app/auth/register',
        {
          username: username,
          password: password,
          email: email,
          avatar: 'https://i.pravatar.cc/200',
          csrfToken
        }
      );
  
      if (response.status === 201) {
        console.log('Användare registrerades framgångsrikt');
        alert("Användare registrerades framgångsrikt")
        navigate('/login');
        setUsername('');
        setPassword('');
        setEmail('');
        setAvatar('');
      } else {
        Sentry.captureMessage('Misslyckades med att registrera användare', 'error');
        throw new Error('Misslyckades med att registrera användare');
      }
    } catch (error) {
      console.error('Registreringsfel:', error);
      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (errorMessage.includes('Username or email already exists')) {
            setError('Användarnamn eller e-post finns redan.');
            Sentry.captureMessage('Användarnamn eller e-post finns redan.', 'error');
          } else if (errorMessage.includes('username')) {
            setError('Vänligen fyll i alla obligatoriska fält.');
            Sentry.captureMessage('Vänligen fyll i alla obligatoriska fält.');
          } else {
            setError(errorMessage);
            Sentry.captureMessage(errorMessage, 'error');
          }
        } 
      }
    }
  };
  

  return (
    <Container className={styles['registration']}>
      <h1 className={styles['registration-h1']} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <img src="/img/LogoMakr.png" alt="logo" style={{ width: '120px', marginRight: '10px' }} />
        Snackis</h1>
      <section className={styles['registrationContainer']}>
        <h2>Skapa ett konto,</h2>
        <p>Det går snabbt och smidigt.</p>
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label></Form.Label>
            <Form.Control
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label></Form.Label>
            <Form.Control
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label></Form.Label>
            <Form.Control
              type="email"
              placeholder="E-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAvatar">
            <Form.Label></Form.Label>
            <Form.Control
              type="text"
              placeholder="Avatar URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group className="mt-3">
            <p style={{ fontSize: "1rem" }}>
              Genom att klicka på "Registrera konto" godkänner du våra villkor. Läs mer om hur vi samlar in,
              använder och delar dina data i vår integritetspolicy och hur vi
              använder cookies och liknande teknologi i vatikanen. Du kan
              komma att få Email-aviseringar från oss och du kan välja bort detta
              när som helst.
            </p>
          </Form.Group>
          <Button variant="success" type="button" style={{ fontSize: "1.3rem" }} onClick={handleRegistration}>
            Registrera konto
          </Button>
          <Form.Group className="mt-3">
            <Link style={{ fontSize: "1.5rem" }} to="/login">Har du redan ett konto?</Link>
          </Form.Group>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
      </section>
    </Container>
  );
};

export default Registration;













