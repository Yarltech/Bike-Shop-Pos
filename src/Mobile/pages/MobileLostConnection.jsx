import React from 'react';
import '../styles/MobileLostConnection.css';
import LostConnectionSVG from '../../img/connectionlost.svg';
import { motion } from 'framer-motion';

const MobileLostConnection = ({ onTryAgain }) => (
  <motion.div
    className="mobile-error-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <img src={LostConnectionSVG} alt="Connection Lost" className="mobile-error-img" />
    <h2>Your connection are lost</h2>
    <p className="mobile-error-desc">
      Please check your internet connection<br />
      and try again
    </p>
    <button className="mobile-error-btn" onClick={onTryAgain}>Try Again</button>
  </motion.div>
);

export default MobileLostConnection; 