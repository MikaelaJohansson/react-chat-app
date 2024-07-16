import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('https://chatify-api.up.railway.app/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const user = response.data;
        setUsername(user.username);
        setEmail(user.email);
        setAvatar(user.avatar);
        setAvatarPreview(user.avatar);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
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
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const imageUrl = data.data.url;

      setAvatar(imageUrl);
      setAvatarPreview(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed: ' + error.toString());
    }
  };

  const handleUpdate = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');

    try {
      await axios.put('https://chatify-api.up.railway.app/user', {
        userId: userId,
        updatedData: {
          avatar,
          email,
          username,
        },
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      sessionStorage.setItem('avatar');
      sessionStorage.setItem('email');
      sessionStorage.setItem('user');
      alert('Profile updated successfully');
      navigate('/Chat');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');

    try {
      await axios.delete(`https://chatify-api.up.railway.app/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Your account has been successfully deleted.');
      sessionStorage.delete(sentryReplaySession)
      sessionStorage.clear();
      window.location.href = '/Login';
    } catch (error) {
      console.error('Error deleting user account', error);
      alert('Failed to delete account. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <label>
          Username:
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
      </div>
      <div>
        <label>
          Avatar:
          <input 
            type="file" 
            onChange={handleFileChange} 
          />
        </label>
      </div>
      {avatarPreview && (
        <div>
          <h3>Avatar Preview:</h3>
          <img 
            src={avatarPreview} 
            alt="Avatar Preview" 
            style={{ width: '100px', height: '100px' }} 
          />
        </div>
      )}
      <div>
        <button onClick={handleUpdate}>Update Profile</button>
        <button onClick={handleDelete}>Delete Account</button>
      </div>
      <Link to="/Chat">Tillbaka till chat</Link>
      <ToastContainer />
    </div>
  );
};

export default Profile;


































