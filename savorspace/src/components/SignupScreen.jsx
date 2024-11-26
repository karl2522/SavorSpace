import { useEffect, useRef, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloudUploadOutline, IoLogoGithub , IoEyeOffOutline, IoEyeOutline} from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import api from '../api/axiosConfig';
import '../styles/SignupStyles.css';
import { useNavigate, useLocation } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const register = async (formData) => {
  const response = await api.post(`/signup`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; 
};

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    profilePic: null,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFileSizeError, setShowFileSizeError] = useState(false);  
  const errorRef = useRef(null); // Ref for the error message
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (errorRef.current && !errorRef.current.contains(event.target)) {
        setShowFileSizeError(false); // Hide error message when clicking outside
      }
    };

    // Add click event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup listener
    };
  }, []);

  useEffect(() => {
    if (showFileSizeError) {
      const timer = setTimeout(() => setShowFileSizeError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showFileSizeError]);

  useEffect(() => {
    const token = query.get('token');
    const refreshToken = query.get('refreshToken');

    if (token && refreshToken) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/homepage');  
    }
  }, [query, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInKB = (file.size / 1024).toFixed(2); // Convert bytes to KB and round to 2 decimal places
      console.log(`Uploaded file size: ${fileSizeInKB} KB`); // Log the file size in KB
      // Check file size (800KB = 800 * 1024 bytes)
      if (file.size > 800 * 1024) {
        setShowFileSizeError(true);
        setFormData((prev) => ({ ...prev, profilePic: null }));
        setImageUrl(null);
      } else {
        setFormData((prev) => ({ ...prev, profilePic: file }));
        fetchImageURL(file);
        setErrorMessage('');
      }
    } else {
      setErrorMessage('');
      setImageUrl(null);
    }
  };

  const fetchImageURL = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Full name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!isChecked) errors.checkbox = 'You must agree to the terms';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if(Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName); 
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (formData.profilePic) {
        data.append('profilePic', formData.profilePic);
      }
      const response = await register(data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Registration successful!');
      if(response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);

      if (error.response) {
        console.error('Error data:', error.response.data);
        alert('Registration failed: ' + (error.response.data.message || error.response.data));
      } else {
        alert('Registration failed: ' + error.message);
      }
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {isLoading && (
      <div className="loading-overlay">
        <div className="loader-container">
          <div className="loader-ring"></div>
          <div className="loader-ring-2"></div>
          <div className="loader-icon">👨‍🍳</div>
        </div>
        <div className="loading-text">
          Preparing your kitchen<span className="loading-dots"></span>
        </div>
      </div>
    )}
      <IoIosArrowBack size={30} color="#000" cursor="pointer" onClick={() => navigate('/')} />
      <div className="form-section">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label>Password</label>
          < div className="password-field" style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                }}
              >
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
          </div>

          <label>Profile Picture</label>
          <div className="profile-upload-container">
            <label htmlFor="file-input" className="custom-file-upload">
              <IoCloudUploadOutline color='white' size={15} />  
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <span className="file-name">{formData.profilePic ? formData.profilePic.name : "No file chosen (File size should be 800kb or below)"}</span>
            {imageUrl && <img src={imageUrl} alt="Profile Preview" className="profile-preview" />}
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
          </div>

          <div className="checkbox">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <span>I agree with SavorSpace&apos;s Terms, Services, Privacy and Policy</span>
          </div>

          <button type="submit" className="register-btn">Create account</button>
        </form>


        <div className="login-options">
          <span>Already have an account? <a href="/login" className="login">Log in</a></span>
          <p>Or register with</p>
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
      <div className="register-hero">
        <img src="src/images/signup-hero.png" alt="Savor the flavor, Share the love" />
        <h3>Savor the flavor, <br />Share the love</h3>
      </div>
      {showFileSizeError && (
        <div ref={errorRef} className="file-size-error"><MdErrorOutline size={30}/>
        File size too large!</div>
      )}
    </div>
  );
};

export default Register;