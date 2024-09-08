import React from 'react';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404</h1>
      <p>Sidan du letar efter kunde inte hittas.</p>
      <p>Vänligen gå tillbaka till <a href="/">startsidan</a>.</p>
    </div>
  );
}

export default NotFound;

