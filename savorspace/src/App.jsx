import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/Homepage';
import LandingPage from './components/LandingPage';
import Login from './components/LoginScreen';
import RecipePage from './components/RecipePage';
import Register from './components/SignupScreen';
import testProfilePic from './images/image.png';
import './styles/MainStyles.css';

// Navbar Component
const Navbar = ({ profilePic }) => {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);
  const isMainPage = 
    location.pathname === '/homepage' || 
    location.pathname === '/recipes' || 
    location.pathname === '/community' || 
    location.pathname === '/aboutus';

  const activeLinkStyle = { color: '#D6589F', fontWeight: 'bold' };

  return (
    <>
      {showNavbar && (
        <nav className="navbar">
          <Link to="/" className="logo">
            <img src="/src/images/savorspaceLogo.png" alt="SavorSpace Logo" className="logo" />
          </Link>
          <h1>
            Savor<span className='highlight'>Space</span>
          </h1>
          <ul>
            <li className={location.pathname === '/homepage' ? 'active' : ''}>
              <Link to="/homepage" style={location.pathname === '/homepage' ? activeLinkStyle : {}}>Home</Link>
            </li>
            <li className={location.pathname === '/recipes' ? 'active' : ''}>
              <Link to="/recipes" style={location.pathname === '/recipes' ? activeLinkStyle : {}}>Recipes</Link>
            </li>
            <li className={location.pathname === '/community' ? 'active' : ''}>
              <Link to="/community" style={location.pathname === '/community' ? activeLinkStyle : {}}>Community</Link>
            </li>
            <li className={location.pathname === '/aboutus' ? 'active' : ''}>
              <Link to="/aboutus" style={location.pathname === '/aboutus' ? activeLinkStyle : {}}>About Us</Link>
            </li>
          </ul>
          {isMainPage ? (
            <div className="mainpage-buttons">
              <div className="profile-pic-container">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="navbar-profile-pic" />
                ) : (
                  <img src={testProfilePic} alt="Test Profile" className="navbar-profile-pic" /> 
                )}
              </div>
            </div>
          ) : (
            <Link to="/register" className="signup-btn">Sign up</Link>
          )}
        </nav>
      )}
    </>
  );
};

const App = () => {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve the token from local storage
        const response = await fetch('http://localhost:8080/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfilePic(`http://localhost:8080${data.imageURL}`); // Set the profile picture URL
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic(); // Fetch the profile picture when the component mounts
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Router>
      <div>
        <Navbar profilePic={profilePic} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

Navbar.propTypes = {
  profilePic: PropTypes.string,
};

export default App;
