import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import styles from '../CSS/Login.module.css';
import Button from 'react-bootstrap/Button';
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
        console.log('CSRF token fetched successfully:', response.data.csrfToken);
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
        console.log('Login successful:', response.data);
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
        <div className={styles['login-text']}>
          <h1 className={styles['login-h1']} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src="/img/LogoMakr.png" alt="logo" style={{ width: '120px', marginRight: '10px' }} />
          Snackis</h1>
            <p>Logga in på ditt Snackis konto. <br />
            Snackis hjälper dig att hålla kontakten 
            med vänner.</p>
            <Link to="/">Tillbaka</Link>
        </div>
        
        <Form className={styles['login-border']}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Användarnamn</Form.Label>
            <Form.Control
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Lösenord</Form.Label>
            <Form.Control
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <Button variant="success" type="button" style={{fontSize: "1.3rem", left:'3rem', position:'relative'}} onClick={handleLogin}>
              Logga in
            </Button>
            <br />
            <Link className={styles['login-link']} to="/registration">Har du inget konto?</Link>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form.Group>
        </Form>
        <br /> 
    </section>  
  );
};

export default Login;
























