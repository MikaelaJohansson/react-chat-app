import React from 'react';
import { useParams } from 'react-router-dom';

const InviteUser = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Invite User</h1>
      <p>Invite ID: {id}</p>
    </div>
  );
};

export default InviteUser;

















