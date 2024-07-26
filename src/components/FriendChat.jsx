import React from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const FriendChat = () => {

  const location = useLocation();
  const { invite } = location.state || {}; // Få invite från state
  console.log(invite);
  return (
    <div>
      {invite ? (
        <div>
          <h1>Chat with {invite.username || invite.conversationId}</h1>
          {/* Din chat-komponent kod här */}
        </div>
      ) : (
        <p>No invite selected</p>
      )}

      <Link to="/Chat">Tillbaka till Chaten</Link>
    </div>
  )
}

export default FriendChat
