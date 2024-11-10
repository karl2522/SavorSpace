import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePageStyles.css';

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    imageURL: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const validatePasswords = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return false;
    }
    if (passwordData.newPassword && !passwordData.oldPassword) {
      setPasswordError("Current password is required");
      return false;
    }
    return true;
  };

  const handleSettings = () => {
    navigate('/profile/settings');
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8080/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      const profilePicUrl = data.imageURL?.startsWith('http') 
        ? data.imageURL 
        : `http://localhost:8080${data.imageURL}`;

      setProfilePic(profilePicUrl);
      setUsername(data.fullName);
      setRole(data.role);
      setUserId(data.id);
      setIsAuthenticated(true);
      setFormData({
        fullName: data.fullName,
        email: data.email,
        imageURL: data.imageURL
      });
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setFormData(prev => ({
          ...prev,
          imageURL: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token || !userId) return;

    try {
      if (passwordData.newPassword || passwordData.oldPassword) {
        if (!validatePasswords()) {
          return;
        }
        const passwordResponse = await fetch('http://localhost:8080/users/change-password', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
          })
        });

        if (!passwordResponse.ok) {
          const errorText = await passwordResponse.text();
          setPasswordError(errorText || 'Failed to update password');
          return;
        }

        setUpdateMessage('Password updated successfully');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }

      // Handle profile update
      const meResponse = await fetch('http://localhost:8080/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!meResponse.ok) throw new Error('Failed to get user data');
      const userData = await meResponse.json();

      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        imageURL: formData.imageURL
      };

      const response = await fetch(`http://localhost:8080/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUsername(updatedData.fullName);
      setProfilePic(updatedData.imageURL);
      setIsEditing(false);
      fetchProfileData();
      setUpdateMessage('Profile updated successfully');

    } catch (error) {
      console.error('Error updating profile:', error);
      setPasswordError(error.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-top">
        <button className="back-button">
          <IoIosArrowBack size={30} />
        </button>
        <h1>My <span className="highlight">Profile</span></h1>
        <button className="settings-button" onClick={handleSettings}>
          <IoSettingsOutline size={30} />
        </button>
      </div>

      <div className="profile-info">
        <div className="profile-main">
          <div className="profile-avatar">
            <img src={profilePic || "/src/images/omen.png"} alt="Profile" />
            {isEditing ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            ) : (
              <button className="edit-profile" onClick={handleEditClick}>
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>

              <div className="password-section">
                <h3>Change Password</h3>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}

              {updateMessage && (
                <div className="success-message">{updateMessage}</div>
              )}

              <div className="form-buttons">
                <button type="submit">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setPasswordError('');
                    setUpdateMessage('');
                    setPasswordData({
                      oldPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <h2>Hi, {username || 'Jared Karl Omen'}</h2>
              <p className="join-date">Joined June 22, 2024</p>
              <p className="profession">{role || 'Software Developer'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
