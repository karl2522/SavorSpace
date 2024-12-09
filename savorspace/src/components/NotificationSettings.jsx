import { useState } from 'react';
import '../styles/NotificationStyles.css';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    all: true,
    posts: false,
    comments: false,
    rates: false,
    favorites: false,
    reports: false,
  });

  const [emailPreferences, setEmailPreferences] = useState({
    dailyUpdates: true,
    weeklyUpdates: false,
    postsUpdates: true,
  });

  const handleToggle = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleCheckbox = (type) => {
    setEmailPreferences(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="notification-settings">
      <h1 className="notification-title">Notification Settings</h1>
      <div className="notification-settings-container">
        <div className="setting-group">
          <h2 className="notif-h2">General Notifications</h2>
          <div className="setting-item">
            <span>Report Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.reports}
                onChange={() => handleToggle('reports')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>Favorite Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.favorites}
                onChange={() => handleToggle('favorites')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>All Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.all}
                onChange={() => handleToggle('all')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>Posts Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.posts}
                onChange={() => handleToggle('posts')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>Comments Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.comments}
                onChange={() => handleToggle('comments')}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>Rates Notifications</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.rates}
                onChange={() => handleToggle('rates')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h2 className="notif-h2">Page Updates</h2>
          <div className="setting-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={emailPreferences.dailyUpdates}
                onChange={() => handleCheckbox('dailyUpdates')}
              />
              <span>Daily Updates</span>
            </label>
          </div>
          <div className="setting-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={emailPreferences.weeklyUpdates}
                onChange={() => handleCheckbox('weeklyUpdates')}
              />
              <span>Weekly Updates</span>
            </label>
          </div>
          <div className="setting-item checkbox">
            <label>
              <input
                type="checkbox"
                checked={emailPreferences.postsUpdates}
                onChange={() => handleCheckbox('postsUpdates')}
              />
              <span>Post Updates</span>
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h2 className="notif-h2">Notification Frequency</h2>
          <div className="setting-item radio">
            <label>
              <input type="radio" name="frequency" value="realtime" defaultChecked />
              <span>Real-time</span>
            </label>
          </div>
          <div className="setting-item radio">
            <label>
              <input type="radio" name="frequency" value="daily" />
              <span>Daily</span>
            </label>
          </div>
          <div className="setting-item radio">
            <label>
              <input type="radio" name="frequency" value="weekly" />
              <span>Weekly</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

