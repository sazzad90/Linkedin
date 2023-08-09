import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Logout:React.FC=()=> {
    const navigate = useNavigate();
    
    useEffect(() => {
        sessionStorage.removeItem('accessToken');
        console.log('logout seccessful, access token: ', sessionStorage.getItem('accessToken')); 
        navigate('/');
      }, []);
      
  return (
    <div></div>
  )
}

export default Logout