import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MobileUnderMaintenance.css';
import UnderMaintenanceSVG from '../../img/undermaintanence.svg';
import { motion } from 'framer-motion';

const MobileUnderMaintenance = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="mobile-error-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img src={UnderMaintenanceSVG} alt="Under Maintenance" className="mobile-error-img" />
      <h2>We're under maintenance</h2>
      <p className="mobile-error-desc">
        Please check back soon just putting little touch<br />
        up on some pretty updates.
      </p>
      <button className="mobile-error-btn" onClick={() => navigate('/signin')}>Back to Home</button>
    </motion.div>
  );
};

export default MobileUnderMaintenance; 