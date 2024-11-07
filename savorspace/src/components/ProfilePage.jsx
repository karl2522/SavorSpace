import { IoIosArrowBack } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import '../styles/ProfilePageStyles.css';

export default function ProfilePage() {
  return (
    <div className="profile-container">
      <div className="profile-top">
        <button className="back-button">
        <IoIosArrowBack size={30} />
        </button>
        <h1>My <span className="highlight">Profile</span></h1>
        <button className="settings-button">
        <IoSettingsOutline size={30} />
        </button>
      </div>

        <div className="profile-info">
            <div className="profile-main">
            <div className="profile-avatar"></div>
            <div className="profile-details">
                <h2>Hi, Jared Karl Omen</h2>
                <p className="join-date">Joined June 22, 2024</p>
                <p className="profession">Chef</p>
                <button className="edit-profile">Edit Profile</button>
            </div>
            </div>
        </div>
        
    </div>
  );
}