import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

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
        console.log('Fetched CSRF Token:', response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
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

        // Save decoded values to sessionStorage
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(decoded.user));
        sessionStorage.setItem('avatar', decoded.avatar);
        
        console.log(decoded);
        navigate('/Chat');

      } else {
        throw new Error('Failed to log in');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setError('Invalid credentials.');
        } else {
          setError('Login failed. Please try again later.');
        }
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
    <div>
      <header>
        <h1>Snackis</h1>
        <h2>Logga in på ditt konto</h2>
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
        <button type="submit" onClick={handleLogin} disabled={!csrfToken}>
          Logga in
        </button>
        <br />
        <Link to="/registration">Har du inget konto?</Link>
        {error && <p>{error}</p>}
      </section>
    </div>
  );
};

export default Login;






















