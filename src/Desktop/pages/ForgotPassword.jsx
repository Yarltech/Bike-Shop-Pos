import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../../API/config';
import '../styles/SignIn.css';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(values.username);
      if (response === "Password reset email sent successfully") {
        notification.success({
          message: 'Verification Code Sent',
          description: 'Please check your email for the verification code.',
          placement: window.innerWidth <= 768 ? 'bottomRight' : 'topRight',
        });
        navigate('/reset-password', { state: { username: values.username } });
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to send verification code. Please try again.',
          placement: window.innerWidth <= 768 ? 'bottomRight' : 'topRight',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred. Please try again.',
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
              <Title level={2} style={{ margin: 0, fontSize: '2rem', textAlign: 'center' }}>Forgot Password</Title>
            </div>
            <p className="mobile-subheading">Enter your username to receive a verification code</p>
            <Form
              name="forgot_password"
              onFinish={onFinish}
              layout="vertical"
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
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                  className="styled-button"
                  style={{ width: '100%' }}
                >
                  SEND VERIFICATION CODE
                </Button>
              </Form.Item>
            </Form>
            <div>
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="link-style"
              >
                Back to Sign In
              </button>
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

export default ForgotPassword; 
