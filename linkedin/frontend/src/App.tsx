import React from 'react';
import './App.css';
import Signin from './components/authentication/Signin';
import Signup from './components/authentication/Signup';
import  {BrowserRouter, Routes}  from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from './components/application/home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './components/authentication/Logout';
import Notification from './components/application/notification/Notification';
import ClickedPost from './components/application/notification/ClickedPost';

const App: React.FC=()=> {
  return (
    <>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Signin />}/>
      <Route path="/Signup" element={<Signup />}/>
      <Route path="/Home" element={<Home />}/>
      <Route path="/Notification/*" element={<Notification />}/>
      <Route path="/Notification/ClickedPost/:postId" element={<ClickedPost />}/>
      <Route path="/Logout" element={<Logout />}/>

      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
