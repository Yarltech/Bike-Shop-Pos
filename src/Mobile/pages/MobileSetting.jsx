import React from 'react';
import '../styles/MobileSetting.css';
import { motion } from 'framer-motion';

const MobileSetting = () => {
  return (
    <motion.div
      className="mobile-setting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Settings</h2>
      {/* Settings content goes here */}
    </motion.div>
  );
};

export default MobileSetting; 