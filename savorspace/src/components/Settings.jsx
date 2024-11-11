import { IoIosArrowBack, IoIosNotificationsOutline } from 'react-icons/io';
import { LiaWalletSolid } from "react-icons/lia";
import { LuUser2 } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { SlLock } from "react-icons/sl";
import { VscSettings } from "react-icons/vsc";
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import '../styles/SettingsStyles.css';
import EditProfileSettings from './EditProfileSettings';

export default function SettingsPage() {
  const location = useLocation();

  const activeLinkStyle = {
     color: '#fff', 
     fontWeight: 500, 
     backgroundColor: '#D6589F', 
     borderRadius: 20, 
  };

  const isActive = (path) => {
    return location.pathname === path ? activeLinkStyle : {};
  };

  return (
    <div className="settings-container">
      <nav className="side-nav">
        <div className="settings-header">
          <IoIosArrowBack size={30} className="back-btn"/>
          <h1>Settings</h1>
          <div className="nav-header"></div>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/profile/settings/general" style={isActive('/profile/settings/general')}>
              <VscSettings size={25} style={{ position: 'absolute', left: 30 }}/>
              General
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/edit-profile" style={isActive('/profile/settings/edit-profile')}>
              <LuUser2 size={25} style={{ position: 'absolute', left: 30}}/>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/account" style={isActive('/profile/settings/account')}>
              <LiaWalletSolid size={25} style={{ position: 'absolute', left: 30}}/>
              Account
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/privacy" style={isActive('/profile/settings/privacy')}>
              <SlLock size={25} style={{ position: 'absolute', left: 30}}/>
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/profile/settings/notifications" style={isActive('/profile/settings/notifications')}>
              <IoIosNotificationsOutline size={25} style={{ position: 'absolute', left: 30}}/>
              Notifications
            </Link>
          </li>
          <li className="logout">
            <Link to="/settings/logout" style={isActive('/settings/logout')}>
              <MdLogout size={25} style={{ position: 'absolute', left: 30}}/>
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      <main className="content">
        {/* Use relative paths for routes */}
        <Routes>
          <Route path="general" element={<div>General Settings</div>} />
          <Route path="edit-profile" element={<EditProfileSettings />} />
          <Route path="account" element={<div>Account Settings</div>} />
          <Route path="privacy" element={<div>Privacy Settings</div>} />
          <Route path="notifications" element={<div>Notification Settings</div>} />
          <Route path="logout" element={<div>Logging Out...</div>} />
        </Routes>
      </main>
    </div>
  );
}
