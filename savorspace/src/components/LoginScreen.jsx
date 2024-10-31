import axios from 'axios';
import { useState } from 'react';
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import './styles.css';

const API_URL = 'http://localhost:8080/auth';

const login = async (loginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Store the token in local storage
  localStorage.setItem('authToken', response.data.token);
  return response;
};

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginData);
      console.log('Login successful!');
      navigate('/homepage');
    } catch (error) {
      console.error('Login failed:', error.response.data);
      alert('Login failed:', error.response.data);
    }
  };

  return (
    <div className="login-container">
      <div className="login-hero">
        <img src="src/images/login-hero.png" alt="Welcome back to SavorSpace" />
        <h3>Welcome back, Chef!</h3>
      </div>
      <div className="arrow-container"></div>
      <div className="form-section-login">
        <h2 className="login-h2">Login to SavorSpace</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            required
          />
          
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />

          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="login-options">
          <span>Don&apos;t have an account? <a href="/register" className="register">Register</a></span>
          <p>Or login with</p>
          <div className="social-options">
            <button className="google-btn">
              <FcGoogle /> Google
            </button>
            <button className="apple-btn">
              <FaApple /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;