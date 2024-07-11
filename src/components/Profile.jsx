// Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details when the component mounts
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('https://chatify-api.up.railway.app/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
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

  const handleUpdate = async () => {
    try {
      await axios.put('https://chatify-api.up.railway.app/user', {
        userId: localStorage.getItem('userId'),
        updatedData: {
          username,
          email,
          avatar
        }
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await axios.delete(`https://chatify-api.up.railway.app/users/${localStorage.getItem('userId')}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        localStorage.clear();
        navigate('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
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
          Avatar URL:
          <input 
            type="text" 
            value={avatar} 
            onChange={(e) => {
              setAvatar(e.target.value);
              setAvatarPreview(e.target.value);
            }} 
          />
        </label>
      </div>
      {avatarPreview && <div>
        <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100px', height: '100px' }} />
      </div>}
      <div>
        <button onClick={handleUpdate}>Update Profile</button>
        <button onClick={handleDelete}>Delete Account</button>
      </div>
      <Link to="/Chat">Tillbaka till chat</Link>

    </div>
  );
};

export default Profile;




























