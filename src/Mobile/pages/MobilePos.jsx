import React from 'react';
import '../styles/MobilePos.css';
import { motion } from 'framer-motion';

const MobilePos = () => {
  return (
    <motion.div
      className="mobile-pos"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2>POS</h2>
      {/* POS content goes here */}
    </motion.div>
  );
};

export default MobilePos;
