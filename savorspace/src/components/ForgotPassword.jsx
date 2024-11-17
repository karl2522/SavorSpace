import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/ForgotPasswordForm.css';
import axios from 'axios'; // Make sure axios is installed
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate passwords match
    if (newPassword !== retypePassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/auth/forgot-password', {
        email: email,
        newPassword: newPassword
      });

      if (response.data.message) {
        setMessage(response.data.message);
        // Clear the form
        setEmail('');
        setNewPassword('');
        setRetypePassword('');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error responses from the server
        if (error.response.status === 404) {
          setError('User not found');
        } else {
          setError(error.response.data.message || 'Failed to reset password');
        }
      } else {
        setError('An error occurred while resetting password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="form-title">Reset Password</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={error ? 'error' : ''}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={error ? 'error' : ''}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="retype-password">Confirm Password</label>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              id="retype-password"
              name="retype-password"
              type="password"
              autoComplete="new-password"
              required
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              placeholder="Confirm new password"
              className={error ? 'error' : ''}
            />
          </div>
        </div>
        <button 
          type="submit" 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ForgotPasswordForm;