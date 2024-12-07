import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../api/AdminConfig";
import "../styles/AdminSignup.css";

const registerAdmin = async (formData) => {
  const response = await api.post(`/create-admin`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    profilePic: null,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInKB = (file.size / 1024).toFixed(2);
      if (file.size > 800 * 1024) {
        alert("File size too large!");
        setFormData((prev) => ({ ...prev, profilePic: null }));
        setImageUrl(null);
      } else {
        setFormData((prev) => ({ ...prev, profilePic: file }));
        fetchImageURL(file);
        setErrorMessage("");
      }
    } else {
      setErrorMessage("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.profilePic) {
        data.append("profilePic", formData.profilePic);
      }

      await registerAdmin(data);
      console.log("Admin registration successful!");
      alert("Admin registration successful!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Admin registration failed:", error);
      if (error.response) {
        alert(
          "Admin registration failed: " +
            (error.response.data.message || error.response.data)
        );
      } else {
        alert("Admin registration failed: " + error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="welcome-container">
        <div className="welcome-content">
          <h2>Welcome Back Admin!</h2>
          <p>Enter your Account details to keep connecting with us</p>
          <button
            className="sign-in-btn"
            onClick={() => navigate("/admin/login")}
          >
            Sign in
          </button>
        </div>
      </div>
      <div className="signup-form-container">
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
        <h1 className="signup-title">
          Create <span className="highlight">Admin</span> Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="profilePic">Profile Picture</label>
            <div className="file-container">
              <label htmlFor="file-input" className="custom-file-upload-admin">
                <IoCloudUploadOutline color="white" size={18} />
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <span className="file-name-admin">
                {formData.profilePic ? (
                  formData.profilePic.name
                ) : (
                  <>
                    No file chosen <br />
                    (File size should be 800kb or below)
                  </>
                )}
              </span>
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile Preview"
                className="profile-preview"
              />
            )}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
          <button type="submit" className="create-account-btn">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
