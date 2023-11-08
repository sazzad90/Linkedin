import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { LinkedinFilled } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFinish = async(values: any) => {
    const { email: emailValue, password: passwordValue } = values;

    // Update the state variables using the form values
    setEmail(emailValue);
    setPassword(passwordValue);

    try {
      // Send a POST request to the server using Axios
      const response = await axios.post("http://localhost/users/login", {
        email: email,
        password: password
      });
      sessionStorage.setItem("accessToken", response.data.accessToken);
      console.log('Response from server:', response.data);
      navigate('/Home');
      // navigate('/Home');
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error sending request:', error);
    }
  };

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
        <Button type="primary" htmlType="submit" className="login-form-button" style = {{width:'100%'}}>
          Log in
        </Button>
        No account? <a href="/signup"  style={{marginLeft:'3px'}}>register now!</a>
        <a className="login-form-forgot" href="" style={{marginLeft:'120px'}}>
          Forgot password?
        </a>
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>
    </Form>
    </>
  );
};

export default Signin;