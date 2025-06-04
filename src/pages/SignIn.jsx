import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/SignIn.css';

const { Title, Text } = Typography;

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (values.username === 'Zedx' && values.password === 'Jesuran2000') {
        notification.success({
          message: 'Login Successful',
          description: 'Welcome to Zed_X Automotive!',
          placement: 'topRight',
        });
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        notification.error({
          message: 'Login Failed',
          description: 'Invalid username or password.',
          placement: 'topRight',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="animated-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="styled-card">
          <motion.div
            className="logo-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title level={2} style={{ margin: 0, fontSize: '1.5rem' }}>SignIn</Title>
          </motion.div>

          <Form
            name="normal_login"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="Enter user name"
                size="large"
                className="styled-input"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
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
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <Typography.Link
                onClick={() => navigate('/forgot-password')}
                style={{ fontSize: '1rem' }}
              >
                Forgot Password?
              </Typography.Link>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={isLoading}
                className="styled-button"
                style={{ width: '100%' }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="copyright"
          >
            <Text type="secondary">© {new Date().getFullYear()} Yarltech. All rights reserved.</Text>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignIn; 