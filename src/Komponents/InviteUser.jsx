import React, { useState } from 'react';
import axios from 'axios';

const InviteUser = ({ onInvite }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [invitationSent, setInvitationSent] = useState(false);

  const handleInvite = async () => {
    const token = sessionStorage.getItem('token'); // Hämta token från session storage

    try {
      // Första steget: Hämta användarinfo baserat på användarnamnet
      const response = await axios.get(`https://chatify-api.up.railway.app/users`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Lägg till token i headern
          
        }
      });

      const invitedUser = response.data;
      const userId = invitedUser.id; // Extrahera användarens ID

      // Logga användarinfo till konsolen
      console.log('Användarinfo:', invitedUser);

      // Andra steget: Skicka inbjudan med användarens ID
      await sendInvitation(userId);

      // Uppdatera state för att visa meddelandet om att inbjudan har skickats
      setInvitationSent(true);
      setError(''); // Töm eventuella tidigare felmeddelanden
      window.location.href = '/Chat';
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Användaren hittades inte. Kontrollera användarnamnet.');
      } else {
        setError('Något gick fel vid hämtning av användaren. Försök igen senare.');
      }
      setInvitationSent(false); // Töm eventuella tidigare framgångsmeddelanden
    }
  };

  const sendInvitation = async (userId) => {
    const token = sessionStorage.getItem('token'); // Hämta token från session storage

    try {
      // Skicka inbjudan med användarens ID
      await axios.post(`https://chatify-api.up.railway.app/invitations`, { userId }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Lägg till token i headern
          'Accept': '*/*'
        }
      });

      console.log('Inbjudan skickad till användarens ID:', userId);
    } catch (error) {
      setError('Något gick fel vid skickandet av inbjudan. Försök igen senare.');
      console.error('Error sending invitation:', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Ange användarnamn" 
      />
      <button onClick={handleInvite}>Bjud in</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {invitationSent && <p>Inbjudan har skickats!</p>}
    </div>
  );
};

export default InviteUser;
















