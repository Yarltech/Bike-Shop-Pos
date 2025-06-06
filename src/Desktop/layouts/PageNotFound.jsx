import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PageNotFound.css';
import backgroundImage from '../../img/404_1.png';

const PageNotFound = () => {
  return (
    <div className="not-found-split-container">
      <div className="not-found-left">
        {/* Mobile top image */}
        <img src={backgroundImage} alt="404" className="not-found-float-img-mobile" />
        <h1 className="not-found-title">Opps! Looks Like Here is Nothing.</h1>
        <p className="not-found-desc">
          The page you're looking for isn't found.<br />
          We suggest you back to home. It's easy...
        </p>
        <Link to="/" className="not-found-home-btn">
          <span className="not-found-btn-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 5L2.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          Back To Home
        </Link>
      </div>
      <div className="not-found-right">
        {/* Desktop/tablet right image */}
        <img src={backgroundImage} alt="404" className="not-found-float-img-desktop" />
      </div>
    </div>
  );
};

export default PageNotFound;
