import { IoIosArrowBack, IoIosNotificationsOutline } from 'react-icons/io';
import { LiaWalletSolid } from "react-icons/lia";
import { LuUser2 } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { SlLock } from "react-icons/sl";
import { VscSettings } from "react-icons/vsc";
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import '../styles/SettingsStyles.css';

export default function SettingsPage() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="settings-container">
        <div className="settings-header">
        <IoIosArrowBack size={30} className="back-btn"/>
            <h1>Settings</h1>
            <div className="nav-header"></div>
        </div>
      <nav className="side-nav">
        <div className="nav-links">
          <Link to="/settings/general" className={isActive('/settings/general')}>
          <VscSettings size={25}/>
          General
          </Link>
          
          <Link to="/settings/profile" className={isActive('/settings/profile')}>
          <LuUser2 size={25}/>
          Profile
          </Link>
          
          <Link to="/settings/account" className={isActive('/settings/account')}>
          <LiaWalletSolid size={25}/>
          Account
          </Link>
          
          <Link to="/settings/privacy" className={isActive('/settings/privacy')}>
          <SlLock size={25}/>
          Privacy
          </Link>
          
          <Link to="/settings/notifications" className={isActive('/settings/notifications')}>
          <IoIosNotificationsOutline size={25}/>
          Notifications
          </Link>
          
          <Link to="/settings/logout" className="logout">
          <MdLogout size={25}/>
          Logout
          </Link>
        </div>
      </nav>

      <main className="content">
        <Routes>
          <Route 
            path="/settings/profile" 
            element={
              <div className="profile-settings">
                <div className="avatar-section">
                  <div className="avatar">
                    <img src="/placeholder.svg" alt="Profile" />
                  </div>
                  <div className="avatar-buttons">
                    <button className="edit-profile">Edit Profile</button>
                    <button className="remove-profile">Remove Profile</button>
                  </div>
                </div>

                <form className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Jared Karl Omen"
                      name="fullName"
                    />
                  </div>

                  <div className="form-group">
                    <label>Username</label>
                    <input 
                      type="email" 
                      defaultValue="jared@gmail.com"
                      name="username"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      defaultValue="••••••••••••"
                      name="password"
                    />
                    <button type="button" className="change-password">
                      Change password
                    </button>
                  </div>

                  <button type="submit" className="update-profile">
                    Update Profile
                  </button>
                </form>
              </div>
            } 
          />
          {/* Add other routes as needed */}
        </Routes>
      </main>
    </div>
  );
}