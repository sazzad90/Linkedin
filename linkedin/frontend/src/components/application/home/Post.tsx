import React from 'react';
import { Card, Image, Row, Col } from 'react-bootstrap';
import { PostProps } from './PostProps';

const Post: React.FC<PostProps> = ({ firstName, lastName, email, content, imageId }) => {
  return (
    <Card className="mt-3">
      <Card.Body>
        <Row>
          <Col md={2}>
            <Image
              src="https://via.placeholder.com/64"
              alt="User Avatar"
              roundedCircle
              fluid
            />
          </Col>
          <Col md={10}>
            <h6>{firstName+' '+lastName}</h6>
            <p style={{fontSize:'12px'}}>{email}</p>
            <p style={{fontSize:'14px'}}>{content}</p>
          </Col>
        </Row>
      </Card.Body>
      {imageId && <Card.Img variant="top" src={`http://127.0.0.1:9000/linkedin/${imageId}`} style={{  maxHeight: '350px'}} alt="Post Image" />}
    </Card>
  );
};

export default Post;
