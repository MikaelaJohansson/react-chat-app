import { useState, useEffect } from 'react';
import axios from 'axios';


const getToken = () => sessionStorage.getItem('token');
const setToken = (token) => sessionStorage.setItem('token', token);
const removeToken = () => sessionStorage.removeItem('token');

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await axios.get('https://chatify-api.up.railway.app/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, setToken, removeToken };
};

export default useAuth;