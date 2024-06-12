import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  const handleRegistration = async () => {
    try {
      const response = await axios.post(
        'https://chatify-api.up.railway.app/auth/register',
        {
          username,
          password,
          email,
          avatar: avatar || 'https://i.pravatar.cc/200',
          csrfToken
        }
      );

      if (response.status === 201) {
        console.log('User registered successfully:', response.data);
        navigate('/login');
        setUsername('');
        setPassword('');
        setEmail('');
        setAvatar('');
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.error;

          if (errorMessage.includes('Username')) {
            setError('Användarnamnet finns redan.');
          } else if (errorMessage.includes('Email')) {
            setError('E-postadressen finns redan.');
          } else if (errorMessage.includes('password')) {
            setError('Lösenordet är ogiltigt.');
          } else {
            setError('Ogiltig begäran. Försök igen.');
          }
        } else if (error.response.status === 403 && error.response.data.error === 'Invalid CSRF token') {
          setError('Ogiltig CSRF-token. Försök igen.');
        } else {
          setError('Registrering misslyckades. Försök igen senare.');
        }
      } else {
        setError('Något gick fel vid registreringen. Försök igen senare.');
      }
    }
  };

  return (
    <div>
      <header>
        <h1>Snakis</h1>
        <h2>Skapa ett konto</h2>
      </header>
      <section>
        <label htmlFor="username">Användarnamn</label>
        <input
          type="text"
          id="username"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Lösenord</label>
        <input
          type="password"
          id="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label htmlFor="email">E-postadress</label>
        <input
          type="email"
          id="email"
          placeholder="E-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="avatar">Profilbild (valfri)</label>
        <input
          type="text"
          id="avatar"
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <br />
        <p>
          Genom att klicka på "Registrera konto" godkänner du våra villkor. Läs mer om hur vi samlar in,
          använder och delar dina data i vår integritetspolicy och hur vi
          använder cookies och liknande teknologi i vår cookiepolicy. Du kan
          komma att få SMS-aviseringar från oss och du kan välja bort detta
          när som helst.
        </p>
        <button type="submit" onClick={handleRegistration}>Registrera konto</button>
        <br />
        <Link to="/">Har du redan ett konto?</Link>
        {error && <p>{error}</p>}
      </section>
    </div>
  );
};

export default Registration;






