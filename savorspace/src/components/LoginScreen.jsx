import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";
import { IoLogoGithub } from "react-icons/io5";
import { useNavigate, useLocation} from 'react-router-dom';
import api from '../api/axiosConfig';
import '../styles/LoginStyles.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const login = async (loginData) => {
  const response = await api.post('/login', loginData);
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response;
};

const Login = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const query = useQuery();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authtoken = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if(authtoken && refreshToken) {
        try {
          const response = await api.post('/verify-token');
          if(response.data.valid) {
            navigate('/homepage');
          }else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
          }
        }catch(error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
      }
    }
  }
  checkAuth();
}, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = query.get('token');
    const refreshToken = query.get('refreshToken');

    if(token && refreshToken) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/homepage');
    }
  }, [query, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
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
      const response = await login(loginData);
      onLogin(); 
      navigate('/homepage');
      if(response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      navigate('/homepage');
      alert('Login successful!');
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-hero">
        <img src="src/images/login-hero.png" alt="Welcome back to SavorSpace" />
        <h3>Welcome back, Chef!</h3>
      </div>
      <div className="arrow-container"></div>
      <IoIosArrowForward className="btn-back" size={30} color="#000" cursor="pointer" onClick={() => window.location.href = '/'} />
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
          {errors.email && <span className="error">{errors.email}</span>}
          
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <button type="submit" className="login-btn">Log In</button>
        </form>
        <div className="login-options">
          <span>Don&apos;t have an account? <a href="/register" className="register">Register</a></span>
          <p>Or login with</p>
          <div className="social-options">
            <button onClick={handleGoogleLogin} className="google-btn">
              <FcGoogle />
              <span>Google</span>
            </button>
            <button onClick={handleGithubLogin} className="github-btn">
              <IoLogoGithub />
              <span>Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;