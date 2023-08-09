import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkedinFilled } from '@ant-design/icons';
import {Row, Col, Form, Button} from 'react-bootstrap'

const TopNavbar:React.FC =()=> {
  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary bg-light">
      <Container>
      <LinkedinFilled style={{ fontSize: '30px', color:'blue' }} />
        <Navbar.Brand href="#home">Linkedin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" style={{marginLeft:'250px'}}>
          <Row style={{marginRight:'100px'}}>
        <Col sm={4} style={{width:'400px'}} >
          <Form className="d-flex" >
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              
            />
            <Button>
              Search
            </Button>
          </Form>
        </Col>
      </Row>
            <Nav.Link href="/Home">Home</Nav.Link>
            <Nav.Link href="/Notification">Notification</Nav.Link>
            <Nav.Link href="/logout">Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

export default TopNavbar;