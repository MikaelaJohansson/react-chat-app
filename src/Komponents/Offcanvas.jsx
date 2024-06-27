import React, { useState } from 'react';
import { Offcanvas as BootstrapOffcanvas, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importera Link från react-router-dom



const OffCanvas = ({ user, avatar }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('avatar');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
    window.location.href = '/login';
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch
      </Button>

      <BootstrapOffcanvas show={show} onHide={handleClose}>
        <BootstrapOffcanvas.Header closeButton>
          <BootstrapOffcanvas.Title>Användare</BootstrapOffcanvas.Title>
        </BootstrapOffcanvas.Header>
        <BootstrapOffcanvas.Body>
          <h1>{user}</h1>
          <img src={avatar} alt="Avatar"  style={{ maxWidth: '40%', height: 'auto' }} ></img>
          <br />
          <button onClick={handleLogout}>Logga ut</button>
          <br />
          <Link to="/profile">
            <button>Redigera profil</button>
          </Link>
        </BootstrapOffcanvas.Body>
      </BootstrapOffcanvas>
    </>
  );
};

export default OffCanvas;








