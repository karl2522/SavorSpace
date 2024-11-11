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
  const navigate = useNavigate();


  const handleSettings = () => {
    navigate('/profile/settings');
  };

  const handleHome = () => {
    navigate('/homepage');
  };

  
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
        <button className="back-button" onClick={handleHome}>
          <IoIosArrowBack size={30} />
        </button>
        <h1>My <span className="highlight">Profile</span></h1>
        <button className="settings-button" onClick={handleSettings}>
          <IoSettingsOutline size={30}/>
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
              <p className="stat-label">Recipes</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">50</p>
              <p className="stat-label">Likes</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">50</p>
              <p className="stat-label">Comments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="user-recipes">

        <div className="latest-recipes">
          <div className="latest-recipes-header">
            <h2>Lastest <span>Recipes</span></h2>
            <button className="view-all">View all</button>
          </div>
            <div className="latest-recipes-container">
              <div className="recipe-item">
                <img src="/src/images/adobo-trend.webp" alt="Recipe 1" />
                <p className="recipe-title">Spaghetti Carbonara</p>
              </div>

              <div className="recipe-item">
                <img src="/src/images/adobo-trend.webp" alt="Recipe 1" />
                <p className="recipe-title">Spaghetti Carbonara</p>
              </div>
            </div>

            
        </div>

        <div className="popular-recipes">
          <div className="popular-recipes-header">
            <h2>Popular <span>Recipes</span></h2>
            <button className="view-all">View all</button>
          </div>
            <div className="latest-recipes-container">
              <div className="recipe-item">
                <img src="/src/images/sinigang-trend.webp" alt="Recipe 2" />
                <p className="recipe-title">Chicken Alfredo</p>
              </div>

              <div className="recipe-item">
                <img src="/src/images/sinigang-trend.webp" alt="Recipe 2" />
                <p className="recipe-title">Chicken Alfredo</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}