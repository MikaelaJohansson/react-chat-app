import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../App.css'; 
import styles from '../CSS/OffCanvas.module.css';

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
      <Button className={styles.CanvasButton} type="button" onClick={handleShow}>
        Profil
      </Button>
      <div >
        <Offcanvas show={show} className={styles.CanvasContainer} onHide={handleClose} style={{padding:"3rem",backgroundColor:"rgb(236, 236, 236)" }}  >
          <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{position:'relative', fontSize:'2rem' }}>Användare:</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{boxShadow:"2px 3px 9px lightgray", borderRadius:"0.3rem", backgroundColor:"white",display:"flex", flexDirection:"column", alignItems:"center"}} >
            <h1 style={{position:'relative', fontSize:'3rem', marginBottom:'1rem'}}>{user}</h1>
            <img src={avatar} alt="Avatar" style={{borderRadius:'0.5rem', width:140, justifyContent:'center', boxShadow: '5px 3px 4px lightgray',backgroundColor: 'rgb(208, 240, 243)' }} />
            <br />
            <Button variant="primary" type="button" style={{margin:"1rem", position:'relative', marginLeft:'3rem', fontSize:'1rem'}} onClick={handleLogout} >
              Logga ut
            </Button>
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









