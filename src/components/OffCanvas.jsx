import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../App.css'; 


const OffCanvas = ({ user, avatar }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div>
      <Button type="button" onClick={handleShow}>
        Profil
      </Button>
      <Offcanvas show={show} onHide={handleClose} style={{ padding: "1rem", backgroundColor: "rgb(236, 236, 236)" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ fontSize: '1.5rem' }}>Användare:</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ boxShadow: "2px 3px 9px lightgray", borderRadius: "0.3rem", backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{user}</h1>
          <img src={avatar} alt="Avatar" style={{ borderRadius: '0.5rem', width: '180px', boxShadow: '5px 3px 4px lightgray', backgroundColor: 'rgb(208, 240, 243)' }} />
          <br />
          <Button variant="primary" type="button" style={{ margin: "1rem", fontSize: '1.2rem' }} onClick={handleLogout}>
            Logga ut
          </Button>
          <Link to="/profile">
            <Button variant="success" type="button" style={{ fontSize: '1.2rem' }}>
              Redigera profil
            </Button>
          </Link>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default OffCanvas;









