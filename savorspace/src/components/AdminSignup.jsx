import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminSignup.css';
import axios from 'axios';

const AdminSignup = () => {
  const [admin, setAdmin] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/admins/register', admin);
      alert('Account created successfully!');
    } catch (error) {
      alert('Error creating account: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Create account
          </button>
        </form>
      </div>
      <div className="welcome-box">
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
        <Link to="/admin/login" className="secondary-btn">Sign in</Link>
      </div>
    </div>
  );
};

export default AdminSignup;