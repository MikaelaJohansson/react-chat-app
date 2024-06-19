import React, { useState } from 'react';
import { Offcanvas as BootstrapOffcanvas, Button, CloseButton } from 'react-bootstrap';

const Offcanvas = ({ user, avatar }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('avatar');
    window.location.href = '/login';
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch
      </Button>

      <BootstrapOffcanvas show={show} onHide={handleClose}>
        <BootstrapOffcanvas.Header>
          <BootstrapOffcanvas.Title>Användare</BootstrapOffcanvas.Title>
          <CloseButton style={{ color: 'black' }} onClick={handleClose} />
        </BootstrapOffcanvas.Header>
        <BootstrapOffcanvas.Body>
          <h1>{user}</h1>
          <img src={avatar} alt="Avatar" />
          <br />
          <button onClick={handleLogout}>Logga ut</button>
        </BootstrapOffcanvas.Body>
      </BootstrapOffcanvas>
    </>
  );
};

export default Offcanvas;




