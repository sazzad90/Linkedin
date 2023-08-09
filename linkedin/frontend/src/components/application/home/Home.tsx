import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import TopNavbar from '../TopNavbar';
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import './Home.css';
import CreatePost from './CreatePost';
import Post from './Post';

const Home: React.FC = () => {
  const accessToken = sessionStorage.getItem('accessToken')

  if(accessToken){
    
  }
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
      <Container fluid className="homepage-container">
        <TopNavbar />
        <Container>
          <Row>
            <Col md={3}>
            </Col>
            <Col md={6}>
              <CreatePost />
            </Col>

            <Col md={3}>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default Home;