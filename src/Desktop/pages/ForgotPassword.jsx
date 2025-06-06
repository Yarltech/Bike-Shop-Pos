import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/ForgotPassword.css';

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, type: 'spring', when: 'beforeChildren', staggerChildren: 0.15 }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success({
        message: 'Reset Link Sent',
        description: 'A password reset link has been sent to your email.',
        placement: 'topRight',
      });
      setTimeout(() => navigate('/'), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <motion.div
        className="forgot-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Title level={2} className="forgot-title">Forgot Password</Title>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Text className="forgot-desc">
            Enter your email address to receive a password reset link.
          </Text>
        </motion.div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="forgot-form"
        >
          <motion.div variants={itemVariants}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </motion.div>
        </Form>
        <motion.div variants={itemVariants}>
          <Button
            type="link"
            onClick={() => navigate('/')} 
            className="forgot-back-btn"
          >
            Back to Sign In
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 