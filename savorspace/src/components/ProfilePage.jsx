import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import '../styles/ProfilePageStyles.css';

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfilePic = async () => {
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
        
        const profilePicUrl = data.imageURL.startsWith('http') 
          ? data.imageURL 
          : `http://localhost:8080${data.imageURL}`;
        
        setProfilePic(profilePicUrl);
        setUsername(data.fullName);
        setRole(data.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-top">
        <button className="back-button">
          <IoIosArrowBack size={30} />
        </button>
        <h1>My <span className="highlight">Profile</span></h1>
        <button className="settings-button">
          <IoSettingsOutline size={30} />
        </button>
      </div>

      <div className="profile-info">
        <div className="profile-main">
          <div className="profile-avatar">
            <img 
              src={profilePic || "/src/images/omen.png"} 
              alt="Profile" 
            />
            <button className="edit-profile">Edit Profile</button>
          </div>
          <div className="profile-details">
            <h2>Hi, {username || 'Jared Karl Omen'}</h2>
            <p className="join-date">Joined June 22, 2024</p>
            <p className="profession">{role || 'Chef'}</p>
          </div>
          <div className="stats-container">
            <div className="stat-item">
              <p className="stat-number">50</p>
              <p className="stat-label">Followers</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">50</p>
              <p className="stat-label">Likes</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">50</p>
              <p className="stat-label">Recipes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}