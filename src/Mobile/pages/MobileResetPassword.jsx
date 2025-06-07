import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../../API/config';
import '../styles/MobileSignIn.css';

const MobileResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get username from location state
  const username = location.state?.username;

  // Redirect if no username is provided
  React.useEffect(() => {
    if (!username) {
      navigate('/forgot-password');
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(verificationCode, newPassword);
      if (response === "Password reset successfully!") {
        navigate('/signin');
      } else {
        setError(response || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="mobile-signin-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="signin-title">Reset Password</h1>
      <p className="signin-subtitle">Enter the verification code sent to your email</p>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label className="signin-label" htmlFor="verificationCode">Verification Code</label>
        <input
          className="signin-input"
          type="text"
          id="verificationCode"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          disabled={isLoading}
          required
        />
        <label className="signin-label" htmlFor="newPassword">New Password</label>
        <input
          className="signin-input"
          type="password"
          id="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <label className="signin-label" htmlFor="confirmPassword">Confirm New Password</label>
        <input
          className="signin-input"
          type="password"
          id="confirmPassword"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <button
          className="signin-btn"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
        </button>
        {error && <div className="signin-error">{error}</div>}
      </form>
      <button
        className="forgot-password"
        type="button"
        onClick={() => navigate('/signin')}
        disabled={isLoading}
      >
        Back to Sign In
      </button>
      <div className="signin-bottom-bg"></div>
    </motion.div>
  );
};

export default MobileResetPassword; 
