import React from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import '../styles/MainLayout.css';

const routeTitleMap = {
  '/dashboard': 'Dashboard',
  '/pos': 'POS',
  '/products': 'Products',
  '/transactions': 'Transactions',
  '/settings': 'Settings',
  '/customers': 'Customers',
  // Add more routes and titles as needed
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const pageTitle = routeTitleMap[location.pathname] || '';

  return (
    <div className="main-layout-flex">
      <SideBar pageTitle={pageTitle} />
      <div className="main-content-area">
        {children}
      </div>
    </div>
  );
};

export default MainLayout; 