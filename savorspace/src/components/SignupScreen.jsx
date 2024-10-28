import { useState } from 'react';
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoCloudUploadOutline } from "react-icons/io5";

import './styles.css';


const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    profilePic: null,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

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
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="register-container">
      <div className="form-section">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <label>Profile Picture</label>
          <div className="profile-upload-container">
            <label htmlFor="file-input" className="custom-file-upload">
              <IoCloudUploadOutline color='white' size={20}/>  
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
            <span>I agree with SavorSpace&apos;s Terms, Services, Privacy and Policy</span>
          </div>

          <button type="submit" className="register-btn">Create account</button>
        </form>
        <div className="login-options">
          <span>Already have an account? <a href="/login" className="login">Login</a></span>
          <p>Or register with</p>
          <div className="social-options">
            <button className="google-btn">
              <FcGoogle/>Google</button>
            <button className="apple-btn">
              <FaApple/>Apple</button>
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
