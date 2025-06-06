import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MobilePageNotFound.css';
import NotFoundSVG from '../../img/pagenotfound.svg';
import { motion } from 'framer-motion';

const MobilePageNotFound = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="mobile-error-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img src={NotFoundSVG} alt="404 Not Found" className="mobile-error-img" />
      <h2>Your page didnt respond.</h2>
      <p className="mobile-error-desc">
        This page doesn't exist or maybe fell asleep!<br />
        We suggest you back to home
      </p>
      <button className="mobile-error-btn" onClick={() => navigate('/signin')}>Back Home</button>
    </motion.div>
  );
};

export default MobilePageNotFound; 