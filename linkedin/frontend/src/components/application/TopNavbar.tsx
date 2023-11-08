import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkedinFilled } from '@ant-design/icons';
import {Row, Col, Form, Button} from 'react-bootstrap'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TopNavbar:React.FC =()=> {
  const [textFieldValue, setTextFieldValue] = useState('');

  useEffect(() => {
    const getName = async () =>{
    try {
      console.log('useEffect');

      const accessToken = sessionStorage.getItem('accessToken')
      console.log("accessToken : ", accessToken);   
       const response = await axios.get("http://localhost/users/getName",
        {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }});
        setTextFieldValue(response.data);
    } catch (error) {
      console.error('Error sending request for useEffect:', error);
    }
  }
  getName();
  }, []); 

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary bg-light">
      <Container>
      <LinkedinFilled style={{ fontSize: '30px', color:'blue' }} />
        <Navbar.Brand href="#home">Linkedin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <span style={{color: 'blue'}}>{textFieldValue}</span>

        <Nav className="me-auto" style={{marginLeft:'210px'}}>
          <Row style={{marginRight:'80px'}}>
        <Col sm={4} style={{width:'350px'}} >
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

