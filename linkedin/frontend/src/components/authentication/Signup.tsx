import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { LinkedinFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { First } from 'react-bootstrap/esm/PageItem';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const onFinish = async(values: any) => {
    console.log('Received values of form: ', values);
    const { email: emailValue,firstName:firstNameValue,lastName:lastNameValue, password: passwordValue } = values;

    // Update the state variables using the form values
    setEmail(emailValue);
    setFirstName(firstNameValue);
    setLastName(lastNameValue);
    setPassword(passwordValue);
    console.log('email: ', emailValue);
    console.log('password: ', passwordValue);

    try {
      // Send a POST request to the server using Axios
      const response = await axios.post("http://localhost/users/register", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        newPassword: password
      });
      sessionStorage.setItem("accessToken", response.data.accessToken);
      console.log('Response from server:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }
  return (
    <>
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ maxWidth: 400, margin:'auto', marginTop:'100px' }}
    >
      <Form.Item>
      <LinkedinFilled style={{ fontSize: '80px', color:'blue' }} />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="firstName"
        rules={[{ required: true, message: 'Please input your first name!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="First name" />
      </Form.Item>
      <Form.Item
        name="lastName"
        rules={[{ required: true, message: 'Please input your last name!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Last name" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="signup-form-button" style = {{width:'100%'}}>
          Sign up
        </Button>
      </Form.Item>
    </Form>
    </>
  );
};

export default Signup;