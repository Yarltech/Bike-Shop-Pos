import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../API/config';
import { getByUsername } from '../../API/UserApi';
import '../styles/MobileSignIn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const MobileSignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await getAccessToken(username, password);
      
      if (response.success) {
        // Fetch user profile by username and store in localStorage
        const userProfile = await getByUsername(username);
        if (userProfile) {
          console.log('Fetched user profile:', userProfile);
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home');
      } else {
        let errorMessage = 'Invalid username or password';
        if (response.error === 'email_not_found') {
          errorMessage = 'Username not found';
        } else if (response.error === 'incorrect_password') {
          errorMessage = 'Incorrect password';
        }
        setError(errorMessage);
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="mobile-signin-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="signin-title">Sign in</h1>
      <p className="signin-subtitle">Welcome back to your favorite<br/>exercise app!</p>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label className="signin-label" htmlFor="username">Username</label>
        <input 
          className="signin-input" 
          type="text" 
          id="username" 
          placeholder="Enter your username" 
          value={username} 
          onChange={e => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <label className="signin-label" htmlFor="password">Password</label>
        <div className="password-input-wrapper">
          <input
            className="signin-input"
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <span
            className="password-eye"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        <button 
          className="signin-btn" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>
        {error && <div className="signin-error">{error}</div>}
      </form>
      <button
        className="forgot-password"
        type="button"
        onClick={() => navigate('/forgot-password')}
        disabled={isLoading}
      >
        Forgot your password?
      </button>
      <div className="signin-bottom-bg"></div>
    </motion.div>
  );
};

export default MobileSignIn; 
