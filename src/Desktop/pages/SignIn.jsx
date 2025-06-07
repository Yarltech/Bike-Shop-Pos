import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { getAccessToken } from '../../API/config';
import { getByUsername } from '../../API/UserApi';
import '../styles/SignIn.css';

const { Title, Text } = Typography;

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const isMobile = window.innerWidth <= 768;
      const response = await getAccessToken(values.username, values.password);
      
      if (response.success) {
        // Fetch user profile by username and store in localStorage
        const userProfile = await getByUsername(values.username);
        if (userProfile) {
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
        notification.success({
          message: 'Login Successful',
          description: 'Welcome to Zed_X Automotive!',
          placement: isMobile ? 'bottomRight' : 'topRight',
        });
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        let errorMessage = 'Invalid username or password.';
        if (response.error === 'email_not_found') {
          errorMessage = 'Username not found.';
        } else if (response.error === 'incorrect_password') {
          errorMessage = 'Incorrect password.';
        }
        notification.error({
          message: 'Login Failed',
          description: errorMessage,
          placement: isMobile ? 'bottomRight' : 'topRight',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: 'An error occurred during login. Please try again.',
        placement: window.innerWidth <= 768 ? 'bottomRight' : 'topRight',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-split-container">
      <div className="signin-left-panel">
        <div className="blue-circles-bg">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <div className="circle circle3"></div>
        </div>
        <div className="welcome-content">
          <Title level={2} className="welcome-title">WELCOME</Title>
          <Text className="welcome-headline">ZEDX AUTOMOTIVE</Text>
          <p className="welcome-desc">
            Welcome to Zedx Automotive, your trusted partner in automotive solutions.
          </p>
        </div>
      </div>
      <div className="signin-right-panel">
        <motion.div
          className="animated-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="styled-card">
            <div className="logo-container">
              <Title level={2} style={{ margin: 0, fontSize: '2rem', textAlign: 'center' }}>Sign in</Title>
            </div>
            <p className="mobile-subheading">Welcome back to your favorite exercise app!</p>
            <Form
              name="normal_login"
              onFinish={onFinish}
              layout="vertical"
              initialValues={{ remember: true }}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  placeholder="Enter your username"
                  size="large"
                  className="styled-input"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  size="large"
                  className="styled-input"
                  suffix={
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                  className="styled-button"
                  style={{ width: '100%' }}
                >
                  SIGN IN
                </Button>
              </Form.Item>
            </Form>
            <div>
              <button type="button" onClick={() => navigate('/forgot-password')} className="link-style">Forgot your password?</button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="copyright"
            >
              <Text type="secondary">© {new Date().getFullYear()} Yarltech. All rights reserved.</Text>
            </motion.div>
          </Card>
          <div className="mobile-bottom-curve"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn; 
