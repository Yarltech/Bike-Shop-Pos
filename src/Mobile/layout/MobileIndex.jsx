import React from 'react';
import MobileNavbar from './MobileNavbar';
import '../styles/MobileIndex.css';
import { Outlet } from 'react-router-dom';

const MobileIndex = ({ children }) => {
  return (
    <div className="mobile-index-container">
      {/* Main content placeholder */}
      <div className="mobile-index-content">
        <Outlet />
      </div>
      <MobileNavbar />
    </div>
  );
};

export default MobileIndex;
