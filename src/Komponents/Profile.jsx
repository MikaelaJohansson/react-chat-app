import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

const Profile = () => {
  const defaultAvatar = '/img/avatar.png'; // Relativ sökväg till standardavataren
  const AvatarImg = sessionStorage.getItem('avatar') || defaultAvatar;
  const UserEmail = sessionStorage.getItem('email');
  const UserName = sessionStorage.getItem('username') || sessionStorage.getItem('user');

  const [oldAvatar, setOldAvatar] = useState(AvatarImg);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [email, setEmail] = useState(UserEmail || '');
  const [username, setUsername] = useState(UserName || '');
  const [editedEmail, setEditedEmail] = useState(email);
  const [editedUsername, setEditedUsername] = useState(username);

  useEffect(() => {
    sessionStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem('user', username);
  }, [username]);

  const debouncedHandleFileChange = useCallback(
    debounce((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }, 500),
    []
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewAvatarFile(file);
    debouncedHandleFileChange(file);
  };

  const handleApprove = () => {
    if (preview) {
      setOldAvatar(preview);
      sessionStorage.setItem('avatar', preview);
      sessionStorage.setItem('email', editedEmail);
      sessionStorage.setItem('username', editedUsername);
      setEmail(editedEmail);
      setUsername(editedUsername);
      window.location.href = '/Chat'; // Navigate to Chat component
    }
  };

  return (
    <div className="App">
      <h1>Uppdatera din profil</h1>
      <div className="preview-container">
          <img 
            src={preview || defaultAvatar} 
            alt="Preview Avatar" 
            className="avatar-preview" 
            style={{ maxWidth: '20%', height: 'auto' }} 
          />
        </div>
      {/* Upload new avatar */}
      <div className="upload-container">
        <h3>Upload New Avatar</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      
      </div>

      {/* Edit email */}
      <div className="email-container">
        <h2>Edit Email</h2>
        <input
          type="email"
          value={editedEmail}
          onChange={(e) => setEditedEmail(e.target.value)}
        />
      </div>

      {/* Edit username */}
      <div className="username-container">
        <h2>Edit Username</h2>
        <input
          type="text"
          value={editedUsername}
          onChange={(e) => setEditedUsername(e.target.value)}
        />
      </div>
      <br />
      {/* Approve and save changes */}
      <button onClick={handleApprove}>Approve and Save Changes</button>
    </div>
  );
};

export default Profile;















