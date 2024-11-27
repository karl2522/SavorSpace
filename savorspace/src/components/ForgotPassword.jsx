import axios from 'axios'; // Make sure axios is installed
import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordForm.css';


const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
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
    <div className="main-container">
      <IoIosArrowBack className="forgot-arrow" size={40} color="#000" cursor="pointer" onClick={() => navigate('/login')} />
      <div className="forgot-password-container">
        <h2 className="form-title">Reset Password</h2>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group-forgot">
            <label htmlFor="email">Email address</label>
            <div className="input-group">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'error' : ''}
              />
            </div>
          </div>
          <div className="form-group-forgot">
            <label htmlFor="new-password">New Password</label>
            <div className="input-group password-field">
              <input
                id="new-password"
                name="new-password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={error ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </div>
          <div className="form-group-forgot">
            <label htmlFor="retype-password">Confirm Password</label>
            <div className="input-group password-field">
              <input
                id="retype-password"
                name="retype-password"
                type={showRetypePassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className={error ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
              >
                {showRetypePassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
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
    </div>
  );
};

export default ForgotPasswordForm;