import { useEffect, useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfileStyles.css';

// EditProfileSettings component
const EditProfileSettings = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        imageURL: ''
    });

    // Password data
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Error messages
    const [passwordError, setPasswordError] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');

    // Default profile picture
    const defaultProfilePic = "/src/images/defaultProfiles.png";
    
  // Image source
    const [imgSrc, setImgSrc] = useState(profilePic || defaultProfilePic);
// Handle image error
    const handleImageError = () => {
        console.log("Image failed to load, using default");
        setImgSrc(defaultProfilePic);
    }
    useEffect(() => { // Update image source when profilePic changes
        setImgSrc(profilePic || defaultProfilePic);
    }, [profilePic]);



    // Navigation
    const navigate = useNavigate();

    // Show password fields
    useEffect(() => {
        if (updateMessage || passwordError) {
            const timer = setTimeout(() => {
                setUpdateMessage('');
                setPasswordError('');
            }, 3000);
            return () => clearTimeout(timer); 
        }
    }, [updateMessage, passwordError]);

    // Handle password change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        setPasswordError(''); // Clear password error
    };

    // Validate passwords
    const validatePasswords = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match"); // Set error message
            return false;
        }

        // Check if old password is provided when new password is
        if (passwordData.newPassword && !passwordData.oldPassword) {
            setPasswordError("Current password is required");
            return false; // Return false if old password is missing
        }

        // Check if new password is at least 6 characters long
        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters long");
            return false; // Return false if new password is too short
        }
        return true; // Return true if all checks pass
    };

    // Fetch profile data
    useEffect(() => {
        fetchProfileData();
    }, []);

    // Fetch profile data
    const fetchProfileData = async () => {
        const token = localStorage.getItem('authToken'); // Get auth token
        if (!token) return;

        // Fetch user data
        try {
            const response = await fetch('http://localhost:8080/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } // Set headers
            });
            if (!response.ok) throw new Error('Network response was not ok'); // Throw error if response is not ok

            const data = await response.json(); // Get data

            setUsername(data.fullName); // Set username
            setUserId(data.id); // Set user ID
            setIsAuthenticated(true); // Set authentication status

            // Set profile picture
            if(data.imageURL) {
                const profilePicUrl = data.imageURL?.startsWith('http') // Check if URL is absolute
                    ? data.imageURL
                    : `http://localhost:8080${data.imageURL}`; // Set profile pic URL
                setProfilePic(profilePicUrl); // Set profile pic
            }else {
                setProfilePic(null); // Set profile pic to null
            }
            
            setFormData({
                fullName: data.fullName,
                email: data.email,
                imageURL: data.imageURL
            }); // Set form data
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
        } // Log error
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle deactivate account
    const handleDeactivate = (e) => {
        e.preventDefault();
        navigate('/deactivate-account'); // Navigate to deactivate account page
      };


    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // update it dawg
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);// para set yung image
            };
            reader.readAsDataURL(file); // read the file
        }
    };

    // Handle upload click
    const handleUploadClick = () => {
        document.getElementById('profileImageInput').click(); // click the input
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token || !userId) return; // Return if no token or user ID

        try {
            if (passwordData.newPassword || passwordData.oldPassword) { // Check if password fields are filled
                if (!validatePasswords()) {
                    return;
                } // Validate passwords
                const passwordResponse = await fetch('http://localhost:8080/users/change-password', { // Fetch password change
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }, // Set headers
                    body: JSON.stringify({
                        oldPassword: passwordData.oldPassword,
                        newPassword: passwordData.newPassword
                    }) // Set body
                });

                if (!passwordResponse.ok) {
                    const errorText = await passwordResponse.text();
                    setPasswordError(errorText || 'Failed to update password');
                    return;
                }

                setUpdateMessage('Password updated successfully');
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }

            // Handle profile update
            const meResponse = await fetch('http://localhost:8080/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!meResponse.ok) throw new Error('Failed to get user data');
            const userData = await meResponse.json();

            const formDataToSend = new FormData();

            const userUpdatedData = {
                fullName: formData.fullName,
                email: formData.email,
            };
            formDataToSend.append('user', new Blob([JSON.stringify(userUpdatedData)], {
                type: 'application/json'
            }));

            if(selectedFile) {
                formDataToSend.append('profilePic', selectedFile);
            }

            const response = await fetch(`http://localhost:8080/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    //'Content-Type': 'application/json'
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedData = await response.json();
            setUsername(updatedData.fullName);

            const newProfilePicUrl = updatedData.imageURL?.startsWith('https')
                ? updatedData.imageURL
                : `http://localhost:8080${updatedData.imageURL}`;
            setProfilePic(newProfilePicUrl);

            setSelectedFile(null);
            fetchProfileData();
            setUpdateMessage('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setPasswordError(error.message);
        }
    };

    
    return (
        <div className="edit-profile-container">
                <div className="edit-profile-main">
                    <div className="edit-profile-avatar">
                        <img src={imgSrc} alt="Profile" onError={handleImageError} />
                        <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                                id="profileImageInput"
                                style={{ display: 'none' }}
                            />
                         <button onClick={handleUploadClick} className="upload-button">
                            Change  Profile
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="edit-profile-form" encType="multipart/form-data">
                        <div className="form-names">
                            <div className="form-profile">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                />
                            </div>

                            <div className="form-profile">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                    

        <div className="password-section">
            <h3>Change Password</h3>
            <div className="form-profile">
                <label>Current Password</label>
                <div className="password-field">
                    <input
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                        {showOldPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
            </div>
        </div>

        <div className="form-profile">
            <label>New Password</label>
            <div className="password-field">
                <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                >
                    {showNewPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
            </div>
        </div>

        <div className="form-profile">
            <label>Confirm New Password</label>
            <div className="password-field">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
            </div>
        </div>
    </div>

                {passwordError && (
                <div className="alert error-alert">{passwordError}</div>
                )}

                {updateMessage && (
                    <div className="alert success-alert">{updateMessage}</div>
                )}

                <div className="form-buttons">
                    <button type="submit">Save Changes</button>
                    <button
                        type="button"
                        onClick={() => {
                            setPasswordError('');
                            setUpdateMessage('');
                            setPasswordData({
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                            navigate('/profile');
                        }}
                    >
                    Cancel
                    </button>
                </div>
                <button className="deact-btn"onClick={handleDeactivate}>Deactivate Account</button>
            </form>
        </div>
    </div>
    );
};

export default EditProfileSettings;
