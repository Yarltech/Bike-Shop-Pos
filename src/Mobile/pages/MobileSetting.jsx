import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { updateUser } from '../../API/UserApi';
import { message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import '../styles/MobileSetting.css';

const MobileSetting = () => {
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsEditing(false);
  }, [location]);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      const userObj = parsed?.responseDto?.[0];
      if (userObj) {
        setUser(userObj);
        setOriginalUser(userObj);
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (!isEditing) return;
    setUser(prev => ({ ...prev, [field]: value }));
  };

  // Handle update
  const handleUpdate = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      password: originalUser?.password,
    };
    const result = await updateUser(updatedUser);
    console.log('updateUser result:', result);
    if (result && result.status) {
      message.success('Profile updated successfully!');
      localStorage.setItem('userProfile', JSON.stringify({ responseDto: [updatedUser] }));
      setIsEditing(false);
    } else {
      message.error('Failed to update profile.');
    }
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.clear();
    // Redirect to login page
    navigate('/signin');
    message.success('Logged out successfully');
  };

  return (
    <motion.div
      className="mobile-setting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-card">
        <div className="profile-header">
          <motion.img 
            src={require('../../img/Admin.jpg')} 
            alt="Profile" 
            className="profile-img"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="profile-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="profile-name">{user?.name || 'User Name'}</h2>
            <div className="profile-role">{user?.userRoleDto?.userRole || 'Role'}</div>
          </motion.div>
        </div>

        <motion.form 
          className="profile-form"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="form-group">
            <label>Username</label>
            <div className="input-group">
              <UserOutlined className="input-icon" />
              <input
                type="text"
                value={user?.userName || ''}
                readOnly={!isEditing}
                onChange={e => handleInputChange('userName', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>
            <div className="input-group">
              <UserOutlined className="input-icon" />
              <input
                type="text"
                value={user?.name || ''}
                readOnly={!isEditing}
                onChange={e => handleInputChange('name', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-group">
              <MailOutlined className="input-icon" />
              <input
                type="email"
                value={user?.emailAddress || ''}
                readOnly={!isEditing}
                onChange={e => handleInputChange('emailAddress', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <div className="input-group">
              <PhoneOutlined className="input-icon" />
              <input
                type="text"
                value={user?.mobileNumber || ''}
                readOnly={!isEditing}
                onChange={e => handleInputChange('mobileNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="button-row">
            {!isEditing ? (
              <motion.button
                type="button"
                className="update-btn"
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEditing(true)}
              >
                <EditOutlined /> Edit Profile
              </motion.button>
            ) : (
              <>
                <motion.button
                  type="button"
                  className="cancel-btn"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setUser(originalUser);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  className="save-btn"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpdate}
                >
                  Save Changes
                </motion.button>
              </>
            )}
          </div>
        </motion.form>

        <motion.div 
          className="logout-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            type="button"
            className="logout-btn"
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
          >
            <LogoutOutlined /> Logout
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MobileSetting; 
