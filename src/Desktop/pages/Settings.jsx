import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { updateUser } from '../../API/UserApi';
import { getAllShopDetails, updateShopDetails } from '../../API/ShopDetailsApi';
import '../styles/Settings.css';

const Settings = () => {
  const [userForm] = Form.useForm();
  const [shopForm] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isShopEditing, setIsShopEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [originalShopDetails, setOriginalShopDetails] = useState(null);

  // Load user profile from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      const userObj = parsed?.responseDto?.[0];
      if (userObj) {
        setUser(userObj);
        setOriginalUser(userObj);
        userForm.setFieldsValue({
          username: userObj.userName || '',
          name: userObj.name || '',
          email: userObj.emailAddress || '',
          mobile: userObj.mobileNumber || '',
        });
      }
    }
  }, [userForm]);

  // Load shop details
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await getAllShopDetails();
        if (response?.status && response?.responseDto?.[0]) {
          const shopData = response.responseDto[0];
          setShopDetails(shopData);
          setOriginalShopDetails(shopData);
          shopForm.setFieldsValue({
            shopName: shopData.name || '',
            mobileNumber: shopData.mobileNumber || '',
            shopAddress: shopData.shopAddress || '',
          });
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
        message.error('Failed to load shop details');
      }
    };
    fetchShopDetails();
  }, [shopForm]);

  // Handle user form save
  const handleUserSave = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      userName: user.username || user.userName,
      name: user.name,
      emailAddress: user.email || user.emailAddress,
      mobileNumber: user.mobile || user.mobileNumber,
      password: originalUser.password,
    };
    const result = await updateUser(updatedUser);
    if (result && result.status) {
      message.success('Profile updated successfully!');
      setUser(updatedUser);
      setOriginalUser(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify({ responseDto: [updatedUser] }));
      setIsUserEditing(false);
    } else {
      message.error('Failed to update profile.');
    }
  };

  // Handle shop form save
  const handleShopSave = async () => {
    if (!shopDetails) return;
    const updatedShop = {
      ...shopDetails,
      name: shopDetails.shopName || shopDetails.name,
      mobileNumber: shopDetails.mobileNumber,
      shopAddress: shopDetails.shopAddress,
    };
    const result = await updateShopDetails(updatedShop);
    if (result && result.status) {
      message.success('Shop details updated successfully!');
      setShopDetails(updatedShop);
      setOriginalShopDetails(updatedShop);
      setIsShopEditing(false);
    } else {
      message.error('Failed to update shop details.');
    }
  };

  return (
    <div className="settings-container">
      {/* User Profile Card */}
      <div className="settings-card">
        <div className="card-header">
          <img src={require('../../img/Admin.jpg')} alt="Profile" className="card-avatar" />
          <div>
            <h2 className="card-title">{user?.name || 'User Profile'}</h2>
            <p className="card-subtitle">{user?.userRoleDto?.userRole || 'Role'}</p>
          </div>
        </div>
        <Form form={userForm} layout="vertical" onFinish={handleUserSave}>
          <div className="form-row">
            <label className="form-label">Username</label>
            <Input
              className="form-input"
              readOnly={!isUserEditing}
              value={user?.userName || ''}
              onChange={e => setUser(prev => ({ ...prev, userName: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Name</label>
            <Input
              className="form-input"
              readOnly={!isUserEditing}
              value={user?.name || ''}
              onChange={e => setUser(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Email Address</label>
            <Input
              className="form-input"
              readOnly={!isUserEditing}
              value={user?.emailAddress || ''}
              onChange={e => setUser(prev => ({ ...prev, emailAddress: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Mobile Number</label>
            <Input
              className="form-input"
              readOnly={!isUserEditing}
              value={user?.mobileNumber || ''}
              onChange={e => setUser(prev => ({ ...prev, mobileNumber: e.target.value }))}
            />
          </div>
          <div className="card-actions">
            {!isUserEditing ? (
              <Button className="btn btn-primary" onClick={() => setIsUserEditing(true)}>
                Update Profile
              </Button>
            ) : (
              <>
                <Button className="btn btn-default" onClick={() => {
                  setUser(originalUser);
                  setIsUserEditing(false);
                }}>
                  Cancel
                </Button>
                <Button className="btn btn-primary" onClick={handleUserSave}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>

      {/* Shop Details Card */}
      <div className="settings-card">
        <div className="card-header">
          <img src={shopDetails?.logo || require('../../img/Admin.jpg')} alt="Shop Logo" className="card-avatar" />
          <div>
            <h2 className="card-title">Shop Details</h2>
            <p className="card-subtitle">{shopDetails?.name || 'Update shop information'}</p>
          </div>
        </div>
        <Form form={shopForm} layout="vertical" onFinish={handleShopSave}>
          <div className="form-row">
            <label className="form-label">Shop Name</label>
            <Input
              className="form-input"
              readOnly={!isShopEditing}
              value={shopDetails?.name || ''}
              onChange={e => setShopDetails(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Mobile Number</label>
            <Input
              className="form-input"
              readOnly={!isShopEditing}
              value={shopDetails?.mobileNumber || ''}
              onChange={e => setShopDetails(prev => ({ ...prev, mobileNumber: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Shop Address</label>
            <Input
              className="form-input"
              readOnly={!isShopEditing}
              value={shopDetails?.shopAddress || ''}
              onChange={e => setShopDetails(prev => ({ ...prev, shopAddress: e.target.value }))}
            />
          </div>
          <div className="card-actions">
            {!isShopEditing ? (
              <Button className="btn btn-primary" onClick={() => setIsShopEditing(true)}>
                Update Shop Details
              </Button>
            ) : (
              <>
                <Button className="btn btn-default" onClick={() => {
                  setShopDetails(originalShopDetails);
                  setIsShopEditing(false);
                }}>
                  Cancel
                </Button>
                <Button className="btn btn-primary" onClick={handleShopSave}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Settings; 
