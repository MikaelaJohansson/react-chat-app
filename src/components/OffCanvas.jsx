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
    <div >
      <Button variant="success" type="button" onClick={handleShow}>
        Profil
      </Button>
      <div>
        <Offcanvas show={show} onHide={handleClose} style={{padding:"3rem"}} >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title style={{position:'relative', fontSize:'2rem', paddingLeft:'1rem' }}>Användare:</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h1 style={{position:'relative', fontSize:'3rem', paddingLeft:'3rem', marginBottom:'1rem'}}>{user}</h1>
            <img src={avatar} alt="Avatar" style={{borderRadius:'0.5rem', width:180, justifyContent:'center', boxShadow: '5px 3px 4px lightgray',backgroundColor: 'rgb(208, 240, 243)' }} />
            <br />
            <Button variant="primary" type="button" style={{margin:"1rem", position:'relative', marginLeft:'3rem', fontSize:'1rem'}} onClick={handleLogout} >
              Logga ut
            </Button>
            <br />
            <Link to="/profile">
            <Button variant="success" type="button"  style={{ position:'relative', marginLeft:'1.7rem', fontSize:'1rem' }} onClick={handleShow}>
              Redigera profil
            </Button>
            </Link>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default OffCanvas;









