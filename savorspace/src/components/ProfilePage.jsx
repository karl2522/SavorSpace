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
  const [joinDate, setJoinDate] = useState('');
  const [userStats, setUserStats] = useState({
    recipeCount: 0,
    rateCount: 0,
    commentCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        setIsLoading(true);
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:8080/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileResponse.json();

        // Set profile data
        setUsername(profileData.fullName);
        setRole(profileData.role);
        setIsAuthenticated(true);
        
        // Fetch user stats
        const statsResponse = await fetch(`http://localhost:8080/users/${profileData.id}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsResponse.json();
        setUserStats(statsData);

        // Handle profile picture
        if(profileData.imageURL) {
          const profilePicUrl = profileData.imageURL.startsWith('http') 
            ? profileData.imageURL 
            : `http://localhost:8080${profileData.imageURL}`;
          setProfilePic(profilePicUrl);
        } else {
          setProfilePic(null);
        }

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const defaultProfilePic = "/src/images/defaultProfiles.png";

  const [imgSrc, setImgSrc] = useState(profilePic || defaultProfilePic);

  useEffect(() => {
    setImgSrc(profilePic || defaultProfilePic);
  }, [profilePic]);

  const handleImageError = () => {
    console.log("Image failed to load, using default");
    setImgSrc(defaultProfilePic);
  }


  const handleSettings = () => {
    navigate('/profile/settings/general');
  };

  const handleHome = () => {
    navigate('/homepage');
  };

  const handleEditProfile = () => {
    navigate('/profile/settings/edit-profile');
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
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return `Joined ${date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}`;
        };

        setJoinDate(formatDate(data.createdAt));

        setUsername(data.fullName);
        setRole(data.role);
        setIsAuthenticated(true);

        if(data.imageURL) {
          const profilePicUrl = data.imageURL.startsWith('http') 
            ? data.imageURL 
            : `http://localhost:8080${data.imageURL}`;
          console.log('Profile pic URL:', profilePicUrl);
          setProfilePic(profilePicUrl);
        }else {
          console.log('Profile pic not found');
          setProfilePic(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-top">
        <button className="back-button-profile" onClick={handleHome}>
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
              src={imgSrc}
              alt="Profile"
              onError={handleImageError} 
            />
            <button className="edit-profile" onClick={handleEditProfile }>Edit Profile</button>
          </div>
          <div className="profile-details">
            <h2>Hi, {username || 'User001'}</h2>
            <p className="join-date">{joinDate}</p>
            <p className="profession">{role || 'Chef'}</p>
          </div>
          <div className="stats-container-profile">
            <div className="stat-item">
              <p className="stat-number">{userStats.recipeCount}</p>
              <p className="stat-labels">Recipes</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">{userStats.rateCount}</p>
              <p className="stat-labels">Rates</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">{userStats.commentCount}</p>
              <p className="stat-labels">Comments</p>
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
                <p className="profile-recipe-title">Spaghetti Carbonara</p>
              </div>

              <div className="recipe-item">
                <img src="/src/images/adobo-trend.webp" alt="Recipe 1" />
                <p className="profile-recipe-title">Spaghetti Carbonara</p>
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
                <p className="profile-recipe-title">Chicken Alfredo</p>
              </div>

              <div className="recipe-item">
                <img src="/src/images/sinigang-trend.webp" alt="Recipe 2" />
                <p className="profile-recipe-title">Chicken Alfredo</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}