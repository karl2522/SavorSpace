import { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePageStyles.css';
import NotificationComponent from './NotificationComponent';

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [joinDate, setJoinDate] = useState('');
  const [userStats, setUserStats] = useState({
    recipeCount: 0,
    ratingCount: 0,
    commentCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const notificationRef = useRef(null);

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

        const latestRecipesResponse = await fetch(
          `http://localhost:8080/recipes/user/${profileData.id}/latest?limit=2`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const popularRecipesResponse = await fetch(
          `http://localhost:8080/recipes/user/${profileData.id}/popular?limit=2`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (latestRecipesResponse.ok) {
          const latestData = await latestRecipesResponse.json();
          setLatestRecipes(latestData);
        }

        if (popularRecipesResponse.ok) {
          const popularData = await popularRecipesResponse.json();
          setPopularRecipes(popularData);
        }

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


  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleHome = () => {
    navigate('/homepage');
  };

  const handleEditProfile = () => {
    navigate('/profile/settings/edit-profile');
  };

  const formatImageURL = (imageURL) => {
    if(!imageURL) return '';
    return imageURL.startsWith('http')
      ? imageURL
      : `http://localhost:8080${imageURL}`;
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
    <div className="profile-main-container">
      <div className="profile-top">
        <button className="back-button-profile" onClick={handleHome}>
          <IoIosArrowBack size={30} />
        </button>
        <h1>My <span className="highlight">Profile</span></h1>
        <div className="left-buttons">
          <NotificationComponent username={username} /> {}
          <button className="settings-button" onClick={handleSettings}>
            <IoSettingsOutline size={30}/>
          </button>
        </div>
      </div>
      <div className="profile-container">
        <div className="profile-info">
          <div className="profile-main">
            <div className="profile-avatar">
              <img 
                src={imgSrc}
                alt="Profile"
                onError={handleImageError} 
              />
              <button className="edit-profile" onClick={handleEditProfile}>Edit Profile</button>
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
                <p className="stat-number">{userStats.ratingCount}</p>
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
              <h2>Latest <span>Recipes</span></h2>
              <button className="view-all">View all</button>
            </div>
            <div className="latest-recipes-container">
              {latestRecipes.map(recipe => (
                <div key={recipe.recipeID} className="recipe-item">
                  <img 
                    src={formatImageURL(recipe.imageURL) || "/src/images/defaultProfiles.png"} 
                    alt={recipe.title} 
                    onError={(e) => {
                      e.target.src = "/src/images/defaultProfiles.png";
                    }}
                  />
                  <p className="profile-recipe-title">{recipe.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="popular-recipes">
            <div className="popular-recipes-header">
              <h2>Popular <span>Recipes</span></h2>
              <button className="view-all">View all</button>
            </div>
            <div className="latest-recipes-container">
              {popularRecipes.map(recipe => (
                <div key={recipe.recipeID} className="recipe-item">
                  <img 
                    src={formatImageURL(recipe.imageURL) || "/src/images/defaultProfiles.png"} 
                    alt={recipe.title} 
                    onError={(e) => {
                      e.target.src = "/src/images/defaultProfiles.png";
                    }}
                  />
                  <p className="profile-recipe-title">{recipe.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}