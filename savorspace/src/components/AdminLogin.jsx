import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminLogin.css';
import api from '../api/axiosConfig';

const loginAdmin = async (loginData) => {
  const response = await api.post('/login-admin', loginData);
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response;
};

export default function AdminLogin() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!loginData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = 'Invalid email address';
    if (!loginData.password) errors.password = 'Password is required';
    else if (loginData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await loginAdmin(loginData);
      navigate('/admin/dashboard');
    } catch (error) {
      alert(`Admin login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo">
          <div className="chef-hat">
            <div className="hat-top"></div>
            <div className="utensils">
              <div className="utensil-left"></div>
              <div className="utensil-right"></div>
            </div>
            <div className="stars">
              <span className="star"></span>
              <span className="star"></span>
            </div>
          </div>
        </div>
        <h1 className="login-title">
          Login to <span className="highlight">Savor</span>Space
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" className="sign-in-btn">
            Sign in
          </button>
        </form>
      </div>
      <div className="welcome-container">
        <div className="welcome-content">
          <h2>Hello, Friend!</h2>
          <p>Tell us more about you and start your journey with us</p>
          <button className="sign-up-btn" onClick={() => navigate('/admin/signup')}>Sign up</button>
        </div>
      </div>
    </div>
  );
}