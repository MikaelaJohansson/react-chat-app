import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Link } from 'react-router-dom';

const Profile = () => {
  const defaultAvatar = '/img/avatar.png';
  const [oldAvatar, setOldAvatar] = useState(defaultAvatar);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editedEmail, setEditedEmail] = useState(sessionStorage.getItem('email') || '');
  const [editedUsername, setEditedUsername] = useState(sessionStorage.getItem('user') || '');

  const UserId = sessionStorage.getItem('id');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 100,
          useWebWorker: false,
        };

        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);

        setNewAvatarFile(compressedFile);
      } catch (error) {
        console.error('Error compressing file:', error);
      }
    }
  };

  const handleApprove = async () => {
    const token = sessionStorage.getItem('token');
    


    console.log('Sending data:', {
      userId: UserId,
      updatedData: {
        avatar: newAvatarFile,
        email: editedEmail,
        user: editedUsername,
      },
    });

    const data = {
      userId: UserId,
      updatedData: {
        avatar: newAvatarFile,
        email: editedEmail,
        user: editedUsername,
      },
    };

    try {
      const response = await axios.put('https://chatify-api.up.railway.app/user   ', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      sessionStorage.setItem('email', editedEmail);
      sessionStorage.setItem('user', editedUsername);
      sessionStorage.setItem('avatar', newAvatarFile);

      console.log('User info updated successfully', response.data);
      window.location.href = '/Chat';
    } catch (error) {
      if (error.response) {
        console.error('Server responded with an error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error updating user info', error);
      alert('Failed to update user info. Please try again later.');
    }
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id'); // Ensure userId is correctly fetched
  
    try {
      const response = await axios.delete(`https://chatify-api.up.railway.app/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User account deleted successfully', response.data);
      alert('Your account has been successfully deleted.');
      sessionStorage.clear();
      window.location.href = '/Login';
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.error('Bad request - Invalid user ID');
        } else if (error.response.status === 404) {
          console.error('User not found');
        } else {
          console.error('Server responded with an error:', error.response.status, error.response.data);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error deleting user account', error);
      alert('Failed to delete account. Please try again later.');
    }
  };
  

  return (
    <div className="App">
      <Link to="/Chat">tillbaka till chat</Link>
      <h2>Update Your Profile</h2>
      <div className="preview-container">
        <img
          src={preview || oldAvatar}
          alt="Preview Avatar"
          className="avatar-preview"
          style={{ maxWidth: '100px', height: 'auto' }}
        />
      </div>

      <div className="upload-container">
        <h3>Upload New Avatar</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="email-container">
        <h2>Edit Email</h2>
        <input
          type="email"
          value={editedEmail}
          onChange={(e) => setEditedEmail(e.target.value)}
        />
      </div>

      <div className="username-container">
        <h2>Edit Username</h2>
        <input
          type="text"
          value={editedUsername}
          onChange={(e) => setEditedUsername(e.target.value)}
        />
      </div>
      <br />

      <button onClick={handleApprove}>Uppdatera profil</button>
      <br />
      <button onClick={handleDelete}>Radera konto</button>
    </div>
  );
};

export default Profile;


























