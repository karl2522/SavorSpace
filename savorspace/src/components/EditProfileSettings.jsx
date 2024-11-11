import { useState } from 'react';

const EditProfileSettings = () => {
  const [fullName, setFullName] = useState('Jared Karl Omen');
  const [username, setUsername] = useState('jared@gmail.com');
  const [password, setPassword] = useState('••••••••••••••');

  return (
    <div className="profile-settings">
      <div className="profile-image">
        <div className="avatar"></div>
        <button className="edit-profile">Edit Profile</button>
        <button className="remove-profile">Remove Profile</button>
      </div>
      <div className="profile-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="change-password">Change password</button>
        </div>
        <button className="update-profile">Update Profile</button>
      </div>
    </div>
  );
};

export default EditProfileSettings;