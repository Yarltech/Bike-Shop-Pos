import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { updateUser } from '../../API/UserApi';
import '../styles/Settings.css';

const initialValues = {
  username: '',
  name: '',
  email: '',
  mobile: '',
  password: '',
};

const Settings = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);

  // Load user profile from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      const userObj = parsed?.responseDto?.[0];
      if (userObj) {
        setUser(userObj);
        setOriginalUser(userObj);
        form.setFieldsValue({
          username: userObj.userName || '',
          name: userObj.name || '',
          email: userObj.emailAddress || '',
          mobile: userObj.mobileNumber || '',
          password: userObj.password || '',
        });
      }
    }
  }, [form]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (!isEditing) return;
    setUser(prev => ({ ...prev, [field]: value }));
    form.setFieldValue(field, value);
  };

  // Cancel editing and revert to original user data
  const handleCancel = () => {
    if (originalUser) {
      setUser(originalUser);
      form.setFieldsValue({
        username: originalUser.userName || '',
        name: originalUser.name || '',
        email: originalUser.emailAddress || '',
        mobile: originalUser.mobileNumber || '',
        password: originalUser.password || '',
      });
    }
    setIsEditing(false);
  };

  // Save handler
  const handleSave = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      userName: user.username || user.userName,
      name: user.name,
      emailAddress: user.email || user.emailAddress,
      mobileNumber: user.mobile || user.mobileNumber,
      password: user.password || '',
    };
    const result = await updateUser(updatedUser);
    console.log('updateUser result:', result);
    if (result && result.status) {
      message.success('Profile updated successfully!');
      setUser(updatedUser);
      setOriginalUser(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify({ responseDto: [updatedUser] }));
      setIsEditing(false);
    } else {
      message.error('Failed to update profile.');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="profile-form"
      initialValues={initialValues}
      onFinish={handleSave}
    >
      <div className="profile-logo-container">
        <img src={require('../../img/Admin.jpg')} alt="Profile" className="profile-logo" />
        <div className="profile-role">{user?.userRoleDto?.userRole || 'Role'}</div>
      </div>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter username' }]}> 
            <Input
              readOnly={!isEditing}
              value={user?.userName || ''}
              onChange={e => handleInputChange('userName', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}> 
            <Input
              readOnly={!isEditing}
              value={user?.name || ''}
              onChange={e => handleInputChange('name', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}> 
            <Input
              readOnly={!isEditing}
              value={user?.emailAddress || ''}
              onChange={e => handleInputChange('emailAddress', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="mobile" label="Mobile Number" rules={[{ required: true, message: 'Please enter mobile number' }]}> 
            <Input
              readOnly={!isEditing}
              value={user?.mobileNumber || ''}
              onChange={e => handleInputChange('mobileNumber', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={24}>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}> 
            <Input.Password
              readOnly={!isEditing}
              value={user?.password || ''}
              onChange={e => handleInputChange('password', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
      {!isEditing ? (
        <div className="profile-actions-row">
          <Button
            type="primary"
            className="save-btn"
            size="large"
            onClick={() => setIsEditing(true)}
          >
            Update
          </Button>
        </div>
      ) : (
        <div className="profile-actions-row">
          <Button
            onClick={handleCancel}
            className="cancel-btn"
            size="large"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="save-btn"
            size="large"
          >
            Save
          </Button>
        </div>
      )}
    </Form>
  );
};

export default Settings; 
