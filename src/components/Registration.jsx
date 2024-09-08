import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../CSS/Registration.module.css';
import * as Sentry from "@sentry/react";

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
          if (errorMessage.includes('Användarnamn eller e-postadress finns redan.')) {
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
    <div className={styles.registration}>
      <header>
        <h1  className={styles['registration-h1']}>
          <img
            src="/img/LogoMakr.png"
            alt="logo"
            style={{ width: '120px' }}
            className="img-fluid"
          />
          Snackis
        </h1>
      </header>
      <section className={styles.registrationContainer}>
        <h2 className="text-center">Skapa ett konto,</h2>
        <p className="text-center">Det går snabbt och smidigt.</p>
        <form>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control-sm"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control-sm"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="E-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control-sm"
            />
          </div>
          <div className="mt-3">
            <p style={{ fontSize: '1rem' }}>
              Genom att klicka på "Registrera konto" godkänner du våra villkor. <br />
              Läs mer om hur vi samlar in, använder och delar din data i Vatikanen.
            </p>
          </div>
          <button  className={styles.registrationButton} type="button" onClick={handleRegistration}>
            Registrera konto
          </button>
          <div className="mt-4 text-center">
            <Link style={{ fontSize: '1.2rem' }} to="/login">Har du redan ett konto?</Link>
          </div>
          {error && <p className="text-center text-danger mt-3">{error}</p>}
        </form>
      </section>
    </div>
  );
};

export default Registration;














