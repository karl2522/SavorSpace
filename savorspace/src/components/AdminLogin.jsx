import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/AdminConfig';
import '../styles/AdminLogin.css';
import chefHatImage from '../images/chef_hat.png';

const loginAdmin = async (loginData) => {
  try {
    const response = await api.post('/login-admin', loginData);
    console.log('API RESPONSE:', response.data);
    if(response.data.token) {
      sessionStorage.setItem('adminToken', response.data.token);
      sessionStorage.setItem('adminRefreshToken', response.data.refreshToken);
      console.log('Admin login successful:', response.data);
  }else {
    throw new Error('No token found in response');
  }
  return response;
  }catch(error) {
    console.error('Admin login failed:', error);
    if(error.response) {
      throw new Error('API Erorr Response:', error.response.data.message);
    }
    throw error;
  }
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
          <img 
            src={chefHatImage} 
            alt="Chef Hat Logo" 
            className="chef-hat-image" 
          />
        </div>
        <h1 className="login-title">
          Login as <span className="highlight">Admin</span>
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
          <button type="submit" className="sign-in-btn-login">
            Sign in
          </button>
        </form>
      </div>
      <div className="welcome-container">
        <div className="welcome-content">
          <h2>Hello, Admin!</h2>
          <p>Tell us more about you and start your journey with us</p>
          <button className="sign-up-btn" onClick={() => navigate('/admin/signup')}>Sign up</button>
        </div>
      </div>
    </div>
  );
}