import React from 'react';
import { useParams } from 'react-router-dom';

const InviteUser = ({ conversationId }) => {
  const { id } = useParams();

  return (
    <div>
      <h1>Invite User</h1>
      <p>Invite ID: {id}</p>
      <p>Conversation ID: {conversationId}</p>
      {/* Ytterligare innehåll eller logik för InviteUser */}
    </div>
  );
};

export default InviteUser;


















