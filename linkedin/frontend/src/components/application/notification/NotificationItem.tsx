import React, { useState } from 'react';
import {NotificationProps} from './NotificationProps'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationItem: React.FC<NotificationProps> = ({ postId, userName, context, createdAt }) => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate(`/Notification/ClickedPost/${postId}`);
  };

  const handleCheckboxChange = async(event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      try {
        console.log('useEffect');
  
        const accessToken = sessionStorage.getItem('accessToken')
        console.log("accessToken : ", accessToken);   
         const response = await axios.post("http://localhost:5050/notifications/checkedNotifications",{
          postId:postId
         }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }});
        console.log('Response from server useEffect data:', response.data);
      } catch (error) {
        console.error('Error sending request for useEffect:', error);
      }
    } else {
      console.log('Checkbox unchecked:', userName);
    }
    event.stopPropagation();
  };

  const notificationContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '5px',
    background: '#f7f7f7',
    cursor: 'pointer',
    width: '100%',
  };

  const checkboxStyles: React.CSSProperties = {
    marginLeft: '10px',
    marginRight: '5px',
  };

  const notificationTextStyles: React.CSSProperties = {
    direction: 'ltr', 
    textAlign: 'left',
    flex: 1, 
  };

  return (
    <div style={{display:'flex'}}>
    <div onClick={handleNotificationClick} style={notificationContainerStyles}>
      <span style={notificationTextStyles}>{userName}{context}</span>
      <span style={notificationTextStyles}>{createdAt}</span>
    </div>
    <input type="checkbox" style={checkboxStyles} checked={isChecked} onChange={handleCheckboxChange}/>
    </div>
  );
};

export default NotificationItem;
