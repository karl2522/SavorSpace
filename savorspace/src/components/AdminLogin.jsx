import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../api/AdminConfig';
import '../styles/AdminLogin.css';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnimationEnd = () => {
    if (!showErrorToast) {
      setErrorMessage('');
    }
  };


  const triggerError = (message) => {
    setErrorMessage(message); 
    setShowErrorToast(true);   
    
    setTimeout(() => {
      setShowErrorToast(false); 
    }, 4700); 
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
      triggerError(`Admin login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="login-container">
      {showErrorToast && (
        <div 
          className="error-alert" 
          onAnimationEnd={handleAnimationEnd} // Reset state after animation ends
        >
          <div className="error-alert-content">
            <div className="error-x">
              <MdClose size={30} />
            </div>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
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