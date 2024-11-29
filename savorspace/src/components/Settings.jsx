import { useState } from 'react';
import { BiLogOut } from "react-icons/bi";
import { IoIosArrowBack, IoMdNotificationsOutline } from 'react-icons/io';
import { LiaWalletSolid } from "react-icons/lia";
import { LuUser2 } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { VscSettings } from "react-icons/vsc";
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../styles/SettingsStyles.css';
import AccountSettings from "./AccountSettings";
import EditProfileSettings from './EditProfileSettings';
import GeneralSettings from "./GeneralSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";

export default function SettingsPage() {
  const location = useLocation();
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutValidation, setShowLogoutValidation] = useState(false);

  const activeLinkStyle = {
     color: '#fff', 
     fontWeight: 500, 
     backgroundColor: '#D6589F', 
     borderRadius: 20, 
  };

  const isActive = (path) => {
    return location.pathname === path ? activeLinkStyle : {};
  };

  const handleLogout = async () => {
    try {
      // First, call your backend logout endpoint
      const response = await fetch('http://localhost:8080/auth/logout/github', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');

      // Reset all user-related states
      setProfilePic(null);
      setUsername('');
      setRole('');
      setIsAuthenticated(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const confirmLogoutValidation = () => {
    setShowLogoutValidation(true);
  };

  const cancelLogout = () => {
    setShowLogoutValidation(false);
  };

  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <nav className="side-nav">
        <div className="settings-header">
          <IoIosArrowBack size={30} className="back-btn" onClick={() => navigate('/profile')}/>
          <h1>Settings</h1>
          <div className="nav-header"></div>
        </div>
        <ul className="nav-links">
          <li> 
            <Link to="/profile/settings/general" style={isActive('/profile/settings/general')}>
              <VscSettings size={23} />
              General
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/edit-profile" style={isActive('/profile/settings/edit-profile')}>
              <LuUser2 size={23} />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/account" style={isActive('/profile/settings/account')}>
              <LiaWalletSolid size={23} />
              Account
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/privacy" style={isActive('/profile/settings/privacy')}>
              <SlLock size={23} />
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/notifications" style={isActive('/profile/settings/notifications')}>
            <IoMdNotificationsOutline size={25} />
              Notifications
            </Link>
          </li>
          <li>
              <div
                className="logout-button-settings"
                style={isActive('/profile/settings/logout')}
                onClick={confirmLogoutValidation}
              >
                <BiLogOut size={23} />
                Logout
              </div>
              {showLogoutValidation && (
                <div className="modal-backdrop">
                  <div className="logout-confirmation">
                    <h2>Logout</h2>
                    <p>
                      Heading out, Chef? No problem!<br /> You can pick up right where you
                      left off whenever you sign back in.
                    </p>
                    <div className="logout-buttons">
                      <button onClick={handleLogout}>Yes</button>
                      <button onClick={cancelLogout}>No</button>
                    </div>
                  </div>
                </div>
              )}
            </li>
        </ul>
      </nav>

      <main className="content">
        {/* Use relative paths for routes */}
        <Routes>
          <Route path="general" element={<GeneralSettings />} />
          <Route path="edit-profile" element={<EditProfileSettings />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="notifications" element= {< NotificationSettings />}/>
        </Routes>
      </main>
    </div>
  );
}
