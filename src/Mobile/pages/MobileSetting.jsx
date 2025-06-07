import React, { useEffect, useState } from 'react';
import '../styles/MobileSetting.css';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateUser } from '../../API/UserApi';
import { message } from 'antd';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

const MobileSetting = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsEditing(false);
  }, [location]);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setUser(parsed?.responseDto?.[0]);
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
    const result = await updateUser(user);
    console.log('updateUser result:', result);
    if (result && result.status) {
      message.success('Profile updated successfully!');
      localStorage.setItem('userProfile', JSON.stringify({ responseDto: [user] }));
      setIsEditing(false);
    } else {
      message.error('Failed to update profile.');
    }
  };

  return (
    <motion.div
      className="mobile-setting"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="profile-container" variants={itemVariants}>
        <motion.img src={require('../../img/Admin.jpg')} alt="Profile" className="profile-img" variants={itemVariants} />
        <motion.h2 className="profile-name" variants={itemVariants}>{user?.name || 'Name'}</motion.h2>
        <motion.div className="profile-role" variants={itemVariants}>{user?.userRoleDto?.userRole || 'Role'}</motion.div>
      </motion.div>
      <motion.form className="profile-form" variants={containerVariants}>
        <motion.label variants={itemVariants}>Email Address</motion.label>
        <motion.div className="input-group" variants={itemVariants}>
          <input
            type="email"
            value={user?.emailAddress || ''}
            readOnly={!isEditing}
            onChange={e => handleInputChange('emailAddress', e.target.value)}
          />
          <span className="input-icon"><i className="fa fa-envelope"></i></span>
        </motion.div>
        <motion.label variants={itemVariants}>Mobile Number</motion.label>
        <motion.div className="input-group" variants={itemVariants}>
          <input
            type="text"
            value={user?.mobileNumber || ''}
            readOnly={!isEditing}
            onChange={e => handleInputChange('mobileNumber', e.target.value)}
          />
          <span className="input-icon"><i className="fa fa-phone"></i></span>
        </motion.div>
        <motion.label variants={itemVariants}>Name</motion.label>
        <motion.div className="input-group" variants={itemVariants}>
          <input
            type="text"
            value={user?.name || ''}
            readOnly={!isEditing}
            onChange={e => handleInputChange('name', e.target.value)}
          />
          <span className="input-icon"><i className="fa fa-user"></i></span>
        </motion.div>
        <motion.label variants={itemVariants}>Username</motion.label>
        <motion.div className="input-group" variants={itemVariants}>
          <input
            type="text"
            value={user?.userName || ''}
            readOnly={!isEditing}
            onChange={e => handleInputChange('userName', e.target.value)}
          />
          <span className="input-icon"><i className="fa fa-user-circle"></i></span>
        </motion.div>
        <motion.div className="button-row" variants={itemVariants}>
          <motion.button
            type="button"
            className={`update-btn${isEditing ? ' editing' : ''}`}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (isEditing) {
                handleUpdate();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? 'Update' : 'Edit'}
          </motion.button>
          <motion.button
            type="button"
            className="logout-btn"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/signin')}
          >
            Logout
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default MobileSetting; 
