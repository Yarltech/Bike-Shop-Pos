import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MobileSignIn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const MobileSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'Zedx' && password === 'Jesuran2000') {
      localStorage.setItem('isAuthenticated', 'true');
      setError('');
      navigate('/home'); // or '/' if you want to use MobileIndex as the root
    } else {
      setError('Invalid email or password');
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
        <label className="signin-label" htmlFor="email">Email</label>
        <input className="signin-input" type="text" id="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="signin-label" htmlFor="password">Password</label>
        <div className="password-input-wrapper">
          <input
            className="signin-input"
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
        <button className="signin-btn" type="submit">SIGN IN</button>
        {error && <div className="signin-error">{error}</div>}
      </form>
      <button
        className="forgot-password"
        type="button"
        onClick={() => navigate('/forgot-password')}
      >
        Forgot your password?
      </button>
      <div className="signin-bottom-bg"></div>
    </motion.div>
  );
};

export default MobileSignIn; 