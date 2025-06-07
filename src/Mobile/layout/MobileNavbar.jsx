import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/MobileNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCashRegister, faHistory, faUserCog, faUser } from '@fortawesome/free-solid-svg-icons';

const navItems = [
  {
    key: '/home',
    label: 'Home',
    icon: faHome,
  },
  {
    key: '/pos',
    label: 'POS',
    icon: faCashRegister,
  },
  {
    key: '/customer',
    label: 'Customer',
    icon: faUser,
  },
  {
    key: '/transaction',
    label: 'Transactions',
    icon: faHistory,
  },
  {
    key: '/profile',
    label: 'Settings',
    icon: faUserCog,
  },
];

const MobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="mobile-navbar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.key;
        return (
          <div
            key={item.key}
            className={`mobile-nav-item${isActive ? ' active' : ''}`}
            onClick={() => navigate(item.key)}
          >
            <span className="mobile-nav-icon">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <span className="mobile-nav-label">{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

export default MobileNavbar;
