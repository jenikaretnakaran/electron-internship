import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import '../css/Navbar.css';

const Navigation = ({ handleConnectWalletClick, showWalletScreen, handleBackButtonClick }) => {
  return (
      <Navbar expand="lg" bg="secondary" variant="dark">
          <Container>
          {showWalletScreen ?
                <Button variant="outline-light" onClick={handleBackButtonClick}>Back</Button> :
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              }
              <Navbar.Collapse>
              {!showWalletScreen && (
                    <Nav className="me-auto">
                      <Nav.Link  as={Link} to="/">Home</Nav.Link>
                      <Nav.Link as={Link} to="/create">Create</Nav.Link>
                      <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                      <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                  )}
                  {!showWalletScreen && (
                    <div className="connectWalletBtnContainer">
                      <Button onClick={handleConnectWalletClick} variant="outline-light">Connect Wallet</Button>
                    </div>
                  )}
              </Navbar.Collapse>
          </Container>
      </Navbar>
  )

}

export default Navigation;