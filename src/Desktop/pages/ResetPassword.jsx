import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../../API/config';
import '../styles/SignIn.css';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get username from location state
  const username = location.state?.username;

  // Redirect if no username is provided
  React.useEffect(() => {
    if (!username) {
      navigate('/forgot-password');
    }
  }, [username, navigate]);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await resetPassword(values.verificationCode, values.newPassword);
      if (response === "Password reset successfully!") {
        notification.success({
          message: 'Password Reset Successful',
          description: 'Your password has been reset successfully. Please sign in with your new password.',
          placement: window.innerWidth <= 768 ? 'bottomRight' : 'topRight',
        });
        navigate('/signin');
      } else {
        notification.error({
          message: 'Error',
          description: response || 'Failed to reset password. Please try again.',
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
              <Title level={2} style={{ margin: 0, fontSize: '2rem', textAlign: 'center' }}>Reset Password</Title>
            </div>
            <p className="mobile-subheading">Enter the verification code sent to your email</p>
            <Form
              name="reset_password"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                label="Verification Code"
                name="verificationCode"
                rules={[{ required: true, message: 'Please input the verification code!' }]}
              >
                <Input
                  placeholder="Enter verification code"
                  size="large"
                  className="styled-input"
                />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  size="large"
                  className="styled-input"
                />
              </Form.Item>
              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm new password"
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
                  RESET PASSWORD
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

export default ResetPassword; 
