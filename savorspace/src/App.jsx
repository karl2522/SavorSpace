import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import AboutUs from './components/AboutUs';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminManageAccounts from './components/AdminManageAccounts';
import AdminManagePosts from './components/AdminManagePosts';
import AdminSignup from './components/AdminSignup';
import PostingPage from './components/CommunityPage';
import AccountDeactivation from './components/DeactivationAccount';
import EditProfileSettings from './components/EditProfileSettings';
import ForgotPasswordForm from './components/ForgotPassword';
import HomePage from './components/Homepage';
import LandingPage from './components/LandingPage';
import Login from './components/LoginScreen';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './components/ProfilePage';
import ReactivateAccount from './components/ReactivateAccount';
import RecipeDetail from './components/RecipeDetail';
import RecipePage from './components/RecipePage';
import SettingsPage from './components/Settings';
import Register from './components/SignupScreen';
import './styles/MainStyles.css';

// Navbar Component
const Navbar = ({ profilePic, handleLogout, isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showNavbar = !['/login', '/register', '/admin/login', '/admin/signup', '/profile', '/reactivate-account', '/deactivate-account', '/admin/ManageUser','/admin/dashboard', '/forgot-password','/admin/ManagePosts'].includes(location.pathname) && !location.pathname.startsWith('/profile/settings');
  const isMainPage = ['/homepage', '/recipes', '/community', '/about-us', '/'].includes(location.pathname) || location.pathname.startsWith('/community/recipe/');

  const activeLinkStyle = { color: '#D6589F', fontWeight: 'bold' };
  const [showDropdown, setShowDropdown] = useState(false);

  const defaultProfilePic = "/src/images/defaultProfiles.png";
  const [imgSrc, setImgSrc] = useState(profilePic || defaultProfilePic);

  useEffect(() => {
    setImgSrc(profilePic || defaultProfilePic);
  }, [profilePic]);

  const handleImageError = () => {
    console.log("Image failed to load, using default");
    setImgSrc(defaultProfilePic);
  }
  const toggleDropdown = useCallback((e) => {
    e.stopPropagation();
    setShowDropdown(prevState => !prevState);
    console.log('Toggle dropdown called');
  }, []);

  const handleOutsideClick = useCallback((e) => {
    if (!e.target.closest('.profile-pic-container')) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  useEffect(() => {
    console.log('Current path:', location.pathname);
    console.log('isMainPage:', isMainPage);
    console.log('showNavbar:', showNavbar);
    console.log('showDropdown:', showDropdown);
  }, [location.pathname, isMainPage, showNavbar, showDropdown]);

  const handleProfilePage = () => {
    navigate('/profile');
    setShowDropdown(false); // Close the dropdown
  };

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
            <li className={location.pathname === '/about-us' ? 'active' : ''}>
              <Link to="/about-us" style={location.pathname === '/about-us' ? activeLinkStyle : {}}>About Us</Link>
            </li>
          </ul>
          {isAuthenticated && isMainPage ? (
            <div className="mainpage-buttons">
              <div className="profile-pic">
                <img 
                  src={imgSrc} 
                  alt="Profile" 
                  onClick={toggleDropdown}
                  onError={handleImageError}
                />
                {showDropdown && (
                  <div className="dropdown-profile">
                    <button onClick={handleProfilePage}>Profile</button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/register" className="signup-btn">Sign up</Link>
              <Link to="/login" className="signin-btn">Log in</Link>
            </div>
          )}
        </nav>
      )}  
    </>
  );  
};

Navbar.propTypes = {
  profilePic: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

const App = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const fetchProfilePic = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    try {
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
  
      setUsername(data.fullName);
      setRole(data.role);
      setIsAuthenticated(true);
      
      if(data.imageURL) {
        const profilePicURL = data.imageURL.startsWith('http')
          ? data.imageURL
          : `http://localhost:8080${data.imageURL}`;
        setProfilePic(profilePicURL);
      }else {
        setProfilePic(null);
      }
  
      console.log('User data: ', data);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setIsAuthenticated(false);
      // Don't remove token or redirect here
    }
  };

  useEffect(() => {
    fetchProfilePic();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    try {
      await fetch('http://localhost:8080/auth/logout/github', {
        method: 'GET',
        credentials: 'include',
      });
    }catch (error) {
      console.error('Error logging out:', error);
    }
    setProfilePic(null);
    setUsername('');
    setRole('');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const handleLogin = () => {
    fetchProfilePic();
  };



  return (
    <Router>
      <div>
        <Navbar profilePic={profilePic} username={username} isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/community" element={<PostingPage isAuthenticated={isAuthenticated} />} />
          <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/settings" element={<SettingsPage />}>
              {/* Routes for Settings Sections */}
              <Route path="general" element={<div>General Settings</div>} />
              <Route path="edit-profile" element={<EditProfileSettings />} />
              <Route path="account" element={<div>Account</div>} />
              <Route path="privacy" element={<div>Privacy</div>} />
              <Route path="notifications" element={<div>Notifications</div>} />
            </Route>
          <Route path="edit-profile" element={<EditProfileSettings />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
           path="/admin/login" 
           element={<PrivateRoute path="/admin/login" element={<AdminLogin />} isAuthenticated={isAuthenticated} role={role} />} />
          <Route 
          path="/admin/signup" 
          element={<PrivateRoute path= "/admin/signup" element={<AdminSignup />} isAuthenticated={isAuthenticated} role={role} />} />
          <Route 
          path="/admin/dashboard" 
          element={<AdminDashboard />} />
          <Route 
          path="/admin/ManageUser" 
          element={<AdminManageAccounts />} />
          <Route 
          path="/admin/ManagePosts" 
          element={<AdminManagePosts />} />
          <Route path="/about-us" element={<AboutUs />} /> {}
          <Route path='/404' element={<NotFound />} />
          <Route path='/reactivate-account' element={<ReactivateAccount />} />
          <Route path='/deactivate-account' element={<AccountDeactivation />} />
          <Route path='/forgot-password' element= {<ForgotPasswordForm />} />
          <Route path="/community/recipe/:recipeId" element={<RecipeDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;