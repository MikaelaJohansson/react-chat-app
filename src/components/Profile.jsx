import React, { useState } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from '../CSS/Profile.module.css';

const Profile = () => {
  const defaultAvatar = '/img/avatar.png';
  const [oldAvatar, setOldAvatar] = useState(defaultAvatar);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editedEmail, setEditedEmail] = useState(sessionStorage.getItem('email') || '');
  const [editedUsername, setEditedUsername] = useState(sessionStorage.getItem('user') || '');
  const [validated, setValidated] = useState(false);

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

  const handleApprove = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('token');
    const UserId = sessionStorage.getItem('id');

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await axios.put(
        'https://chatify-api.up.railway.app/user',
        {
          userId: UserId,
          
          updatedData: {
            avatar: newAvatarFile,
            email: editedEmail,
            username: editedUsername,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

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
    <div className={styles['profile-main']}>
      <h1 className={styles['profile-h1']}>Här kan du uppdatera din profil</h1>
      <div className={styles['profile-container']}>
        <div>
          <img
            src={preview || oldAvatar}
            alt="Preview Avatar"
            className="avatar-preview"
            style={{ maxWidth: '100px', height: 'auto' }}
          />
        </div>

        <div className={styles['upload-container']}>
          <p>Ladda upp ny avatar</p>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            isInvalid={validated && !newAvatarFile}
          />
          <Form.Control.Feedback type="invalid">
            Please choose an image file.
          </Form.Control.Feedback>
        </div>

        <div  className={styles['email-container']}>
          <p className={styles['profile-text']}>Redigera Email</p>
          <Form.Control
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email address.
          </Form.Control.Feedback>
        </div>

        <div className={styles['username-container']}>
          <p className={styles['profile-text']}>Redigera användarnamn</p>
          <Form.Control
            type="text"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a username.
          </Form.Control.Feedback>
        </div>
        <Button variant="success" className={styles['profile-button']} onClick={handleApprove}>Uppdatera profil</Button>
        <br />
        <Button className={styles['profile-button-blue']} onClick={handleDelete}>Radera konto</Button>
      </div>
      <Link  className={styles['profile-link']} to="/Chat">Tillbaka till chat</Link>
    </div>  
  );
};

export default Profile;



























