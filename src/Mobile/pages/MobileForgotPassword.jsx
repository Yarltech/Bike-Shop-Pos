import React from 'react';
import '../styles/MobileForgotPassword.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MobileForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="mobile-forgot-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="forgot-back-arrow"
        onClick={() => navigate('/signin')}
        aria-label="Back to Sign In"
        type="button"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1 className="forgot-title">Forgot Password</h1>
      <p className="forgot-subtitle">Enter your email to reset your password.</p>
      <form className="forgot-form">
        <label className="forgot-label" htmlFor="email">Email</label>
        <input className="forgot-input" type="email" id="email" placeholder="Enter your email" />
        <button className="forgot-btn" type="submit">SEND RESET LINK</button>
      </form>
      <div className="forgot-bottom-bg"></div>
    </motion.div>
  );
};

export default MobileForgotPassword; 