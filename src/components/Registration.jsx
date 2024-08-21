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
          avatar: '/img/avatar.png',
          csrfToken
        }
      );
  
      if (response.status === 201) {
        console.info('Användare registrerades framgångsrikt');
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
    <Container fluid className={styles.registration}>
    <header className="text-center my-4">
      <h1 className={styles['registration-h1']} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <img
          src="/img/LogoMakr.png"
          alt="logo"
          style={{ width: '150px', marginRight: '10px' }}
          className="img-fluid"
        />
        Snackis
      </h1>
    </header>
    <section className={styles.registrationContainer}>
      <h2 className="text-center">Skapa ett konto,</h2>
      <p className="text-center">Det går snabbt och smidigt.</p>
      <Form>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label className="d-none">Användarnamn</Form.Label>
          <Form.Control
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control-lg"
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label className="d-none">Lösenord</Form.Label>
          <Form.Control
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control-lg"
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mb-4">
          <Form.Label className="d-none">E-postadress</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-postadress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control-lg"
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <p style={{ fontSize: '1rem' }}>
            Genom att klicka på "Registrera konto" godkänner du våra villkor.
            Läs mer om hur vi samlar in, använder och delar din data i Vatikanen.
          </p>
        </Form.Group>
        <Button variant="success" type="button" className="w-100 py-2" style={{ fontSize: '1.3rem' }} onClick={handleRegistration}>
          Registrera konto
        </Button>
        <Form.Group className="mt-4 text-center">
          <Link style={{ fontSize: '1.5rem' }} to="/login">Har du redan ett konto?</Link>
        </Form.Group>
        {error && <p className="text-center text-danger mt-3">{error}</p>}
      </Form>
    </section>
  </Container>
  );
};

export default Registration;













