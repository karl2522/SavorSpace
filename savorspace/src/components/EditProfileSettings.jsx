import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfileStyles.css';

const EditProfileSettings = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        imageURL: ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    
    const defaultProfilePic = "/src/images/defaultProfiles.png";
    
  
    const [imgSrc, setImgSrc] = useState(profilePic || defaultProfilePic);

    const handleImageError = () => {
        console.log("Image failed to load, using default");
        setImgSrc(defaultProfilePic);
    }
    useEffect(() => {
        setImgSrc(profilePic || defaultProfilePic);
    }, [profilePic]);



    const navigate = useNavigate();

    useEffect(() => {
        if (updateMessage || passwordError) {
            const timer = setTimeout(() => {
                setUpdateMessage('');
                setPasswordError('');
            }, 3000);
            return () => clearTimeout(timer); 
        }
    }, [updateMessage, passwordError]);
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        setPasswordError('');
    };

    const validatePasswords = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return false;
        }
        if (passwordData.newPassword && !passwordData.oldPassword) {
            setPasswordError("Current password is required");
            return false;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters long");
            return false;
        }
        return true;
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
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

            setUsername(data.fullName);
            setUserId(data.id);
            setIsAuthenticated(true);

            if(data.imageURL) {
                const profilePicUrl = data.imageURL?.startsWith('http')
                    ? data.imageURL
                    : `http://localhost:8080${data.imageURL}`;
                setProfilePic(profilePicUrl);
            }else {
                setProfilePic(null);
            }
            
            setFormData({
                fullName: data.fullName,
                email: data.email,
                imageURL: data.imageURL
            });
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeactivate = (e) => {
        e.preventDefault();
        navigate('/deactivate-account');
      };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // update it dawg
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);// para set yung image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        document.getElementById('profileImageInput').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token || !userId) return;

        try {
            if (passwordData.newPassword || passwordData.oldPassword) {
                if (!validatePasswords()) {
                    return;
                }
                const passwordResponse = await fetch('http://localhost:8080/users/change-password', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        oldPassword: passwordData.oldPassword,
                        newPassword: passwordData.newPassword
                    })
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
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="form-profile">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="form-profile">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                />
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
