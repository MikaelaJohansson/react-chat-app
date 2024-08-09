import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap'; 

const Home = () => {
  return (
    <Container className="text-center">
      <h1></h1>
      <h1  style={{ display: 'inline-flex', alignItems: 'center' }}>
        <img src="/img/LogoMakr.png" alt="logo" style={{ width: '150px', marginRight: '10px' }} />
        Välkommen till Snackis!</h1>
      <br />
      <p>På Snackis har vi skapat en plattform där du kan dela tankar och idéer, 
        och ha meningsfulla konversationer. Oavsett om du vill diskutera de senaste trenderna, 
        planera en resa eller bara småprata om vardagen, så är Snackis det perfekta stället för dig.

        Med en enkel och intuitiv design är Snackis lätt att använda och ger dig möjligheten att chatta med dina vänner i realtid. 
        Vi värdesätter din integritet och säkerhet, vilket är varför vi har byggt in robusta funktioner för att skydda dina personliga uppgifter och samtal.
        <br />
        <br />
        Börja chatta idag – anslut till Snackis och bli en del av vår växande gemenskap!</p>
      <div>
        <Link to="/login">
          <Button variant="primary" className="m-2">Logga in</Button>
        </Link>
        <Link to="/Registration">
          <Button variant="secondary" className="m-2">Skapa konto</Button>
        </Link>
      </div>
    </Container>
  );
};

export default Home;
