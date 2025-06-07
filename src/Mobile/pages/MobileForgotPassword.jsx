import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../../API/config';
import '../styles/MobileSignIn.css';

const MobileForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await forgotPassword(username);
      if (response === "Password reset email sent successfully") {
        navigate('/reset-password', { state: { username } });
      } else {
        setError('Failed to send verification code. Please try again.');
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
      <h1 className="signin-title">Forgot Password</h1>
      <p className="signin-subtitle">Enter your username to receive a<br/>verification code</p>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label className="signin-label" htmlFor="username">Username</label>
        <input
          className="signin-input"
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />
        <button
          className="signin-btn"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'SENDING...' : 'SEND VERIFICATION CODE'}
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

export default MobileForgotPassword; 