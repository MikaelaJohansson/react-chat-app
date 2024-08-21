import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap'; 
import styles from '../CSS/Home.module.css';
import '../App.css'; 

const Home = () => {
  return (
    <Container className={`text-center ${styles.textCenter}`}>
      <Row className="align-items-center">
        <Col>
          <h1>
            <img 
              src="/img/LogoMakr.png" 
              alt="logo" 
              style={{ width: '100%', maxWidth: '170px', marginRight: '10px' }} 
            />
            Välkommen till Snackis!
          </h1>
          <p>
            På Snackis har vi skapat en plattform där du kan dela tankar och idéer, 
            och ha meningsfulla konversationer. Oavsett om du vill diskutera politik 
            eller bara småprata om vardagen, så är Snackis det perfekta stället för dig.
            Med en enkel och intuitiv design är Snackis lätt att använda 
            och ger dig möjligheten att chatta med dina vänner i realtid.
            <br />
            <br />
            Börja chatta idag – anslut till Snackis och bli en del av vår växande gemenskap!
          </p>
          <div>
            <Link to="/login">
              <Button variant="primary" className="m-2">Logga in</Button>
            </Link>
            <Link to="/Registration">
              <Button variant="secondary" className="m-2">Skapa konto</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

