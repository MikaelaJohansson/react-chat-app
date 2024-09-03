import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import styles from '../CSS/Login.module.css';
import * as Sentry from "@sentry/react";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.patch('https://chatify-api.up.railway.app/csrf');
        console.info('CSRF token fetched successfully!');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        Sentry.captureMessage('Error fetching CSRF token:', 'error');
        console.error('Error fetching CSRF token:', error);
        setError('Failed to fetch CSRF token. Please try again later.');
      }
    };

    fetchCsrfToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://chatify-api.up.railway.app/auth/token',
        {
          username,
          password,
          csrfToken,
        }
      );

      if (response.status === 200) {
        console.log('lyckad inloggning');
        const token = response.data.token;
        const decoded = jwtDecode(token);

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('username', decoded.user);
        sessionStorage.setItem('email', decoded.email);
        sessionStorage.setItem('avatar', decoded.avatar);
        sessionStorage.setItem('id', decoded.id);

        navigate('/Chat');
      } else {
        Sentry.captureMessage('Failed to log in', 'error');
        console.error('Failed to log in:', response);
        throw new Error('Failed to log in');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Sentry.captureMessage('Invalid credentials', 'error');
          console.error('Invalid credentials:', error.response);
          setError('Invalid credentials.');
        } else {
          Sentry.captureMessage('Login failed. Please try again later.', 'error');
          console.error('Login failed:', error.response);
          setError('Login failed. Please try again later.');
        }
      } else {
        Sentry.captureMessage('Unexpected error during login', 'error');
        console.error('Unexpected error during login:', error);
        setError('Unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <section className={styles['login-form']}>
      <div className={`${styles['login-text']} text-center mb-4`}>
        <h1 className={styles['login-h1']}>
          <img src="/img/LogoMakr.png" alt="logo" className={styles['login-logo']} />
          Snackis
        </h1>
        <p>Logga in på ditt Snackis konto. <br />
          Snackis hjälper dig att hålla kontakten med vänner.
        </p>
        <Link to="/">Tillbaka</Link>
      </div>
      <form className={`${styles['login-border']} mx-auto ${styles['login-form-container']}`}>
        <div className="mb-3">
          <label htmlFor="formUsername">Användarnamn</label>
           <br />
          <input
            type="text"
            id="formUsername"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles['form-control-sm']}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formPassword">Lösenord</label>
          <br />
          <input
            type="password"
            id="formPassword"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles['form-control-sm']}
          />
        </div>
        <div className="text-center">
          <button type="button" className={styles['login-button']} onClick={handleLogin}>
            Logga in
          </button>
        </div>
        <div className="text-center mt-3">
          <Link className={styles['login-link']} to="/registration">Har du inget konto?</Link>
        </div>
        {error && <div className={`${styles['alert']} mt-3 text-center`}>{error}</div>}
      </form>
      <br />
    </section>
  );
};

export default Login;

























