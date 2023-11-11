import React, { useEffect, useState } from 'react'
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import TopNavbar from '../TopNavbar';
import NotificationItem from './NotificationItem';
import axios from 'axios';
import {NotificationProps} from './NotificationProps'

const Notification:React.FC=()=> {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    
    const fetchNotifications = async () => {
    try {
      console.log('useEffect');

      const accessToken = sessionStorage.getItem('accessToken')
      console.log(`Bearer ${accessToken}`);   
      const response = await axios.get("http://localhost/notifications/getNotifications", {
        headers: {
      'Authorization': `Bearer ${accessToken}`,
      }
  });
        setNotifications(response.data);
      console.log('Response from server useEffect data:', response.data);
    } catch (error) {
      console.error('Error sending request for useEffect:', error);
    }
  }
  fetchNotifications();
  
  },[]);

      const headerStyles: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: '20px',
        marginTop: '20px',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
      };



  

      
  return (
    <>
    <Container fluid className="notification-container">
        <TopNavbar />
        <Container>
          <Row>
            <Col md={3}> </Col>
            <Col md={6}>  
            <h2 style={headerStyles}>Notifications</h2>    
            {Array.isArray(notifications) && notifications.map((notification, index) => (
                 <NotificationItem key={index} postId = {notification.postId} userName={notification.userName} context={' has posted recently'} createdAt={notification.createdAt}  />
            ))} 
            </Col>
            <Col md={3}>
            </Col>
        </Row>
        </Container>
    </Container>
    </>
  )
}

export default Notification