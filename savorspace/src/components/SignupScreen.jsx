import { useState } from 'react';
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import '../styles/SignupStyles.css';
import api from '../api/axiosConfig';

const register = async (formData) => {
  const response = await api.post('/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    profilePic: null,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePic: file }));
    fetchImageURL(file);
  };

  const fetchImageURL = (file) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (formData.profilePic) data.append('profilePic', formData.profilePic);

      await register(data);
      alert('Registration successful!');
    } catch (error) {
      alert(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="register-container">
      <IoIosArrowBack size={30} color="#000" cursor="pointer" onClick={() => window.location.href = '/'} />
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
          {errors.fullName && <span className="error">{errors.fullName}</span>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <label>Profile Picture</label>
          <div className="profile-upload-container">
            <label htmlFor="file-input" className="custom-file-upload">
              <IoCloudUploadOutline color='white' size={20} />  
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <span className="file-name">{formData.profilePic ? formData.profilePic.name : "No file chosen"}</span>
            {imageUrl && <img src={imageUrl} alt="Profile Preview" className="profile-preview" />}
          </div>

          <div className="checkbox">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <span>I agree with SavorSpace's Terms, Services, Privacy and Policy</span>
          </div>
          {errors.checkbox && <span className="error">{errors.checkbox}</span>}

          <button type="submit" className="register-btn">Create account</button>
        </form>
        <div className="login-options">
          <span>Already have an account? <a href="/login" className="login">Login</a></span>
          <p>Or register with</p>
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
      <div className="register-hero">
        <img src="src/images/signup-hero.png" alt="Savor the flavor, Share the love" />
        <h3>Savor the flavor, <br />Share the love</h3>
      </div>
    </div>
  );
};

export default Register;