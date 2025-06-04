import React from 'react';
import { Card, Form, Input, Button, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SignIn = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Here you would typically integrate with your authentication service
    // For this example, we'll just simulate a successful login and redirect

    if (values.username === 'admin' && values.password === 'password') {
      notification.success({
        message: 'Login Successful',
        description: 'Welcome back!',
        placement: 'topRight',
      });
      // Simulate setting authentication token or state
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/'); // Redirect to dashboard after successful login
    } else {
      notification.error({
        message: 'Login Failed',
        description: 'Invalid username or password.',
        placement: 'topRight',
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f0f2f5',
    }}>
      <Card 
        style={{
          width: '100%',
          maxWidth: 500,
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2}>Yarltech POS</Title>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            username: 'admin',
            password: 'password',
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="Username"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          {/* Optional: Remember me and Forgot password */}
          {/*
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="">Forgot password</a>
          </Form.Item>
          */}

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large">
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Text type="secondary">© {new Date().getFullYear()} Yarltech. All rights reserved.</Text>
        </div>
      </Card>
    </div>
  );
};

export default SignIn; 