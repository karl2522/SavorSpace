import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DeActivateStyles.css';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

// Main component for account deactivation
const AccountDeactivation = () => {
    // State hooks to manage input and UI behavior
    const [email, setEmail] = useState(''); // User email
    const [password, setPassword] = useState(''); // User password
    const [error, setError] = useState(''); // Error message
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
    const [deactivateNotification, setDeactivateNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate(); // React Router navigation

    // Handle form submission
    const handleDeactivate = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        setShowModal(true); // Show confirmation modal
    };

    // Confirm account deactivation
    const confirmDeactivation = async () => {
        setIsLoading(true); // Set loading state to true
        setError(''); // Clear any previous errors

        try {
            const response = await fetch('http://localhost:8080/auth/deactivate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to deactivate account');
            }

            // Clear local storage (example of unused tokens removal)
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            // Show success notification
            setDeactivateNotification({
                show: true,
                message: data.message || 'Account deactivated successfully',
                type: 'success'
            });

            // Redirect user after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            // Handle errors (example of error setting)
            setError(error.message);
            setDeactivateNotification({
                show: true,
                message: error.message,
                type: 'error'
            });
        } finally {
            setIsLoading(false); // Reset loading state
            setShowModal(false);  // Hide modal
        }
    };

    // Cancel account deactivation
    const handleCancelDeactivation = () => {
        setShowModal(false); // Close confirmation modal
    };

    // Example of additional variable (not used)
    const unusedVariable = "This is an unused variable for demonstration purposes.";

    return (
        <div className="deactivate-account-container">
            {/* Main heading for the page */}
            <h2>Deactivate Your Account</h2>

            {/* Warning section */}
            <div className="warning-message">
                <p>⚠️ Warning: Deactivating your account will:</p>
                <ul>
                    <li>Temporarily disable your access to the account</li>
                    <li>Hide your profile from other users</li>
                    <li>Require reactivation to access your account again</li>
                </ul>
            </div>

            {/* Form section */}
            <form onSubmit={handleDeactivate}>
                <div className="form-deactivate">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-deactivate">
                    <label>Password</label>
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                paddingRight: '2.5rem',
                                alignItems: 'center',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#666'
                            }}
                        >
                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>            
                    </div>
                </div>

                {/* Error message display */}
                {error && <div className="error-message">{error}</div>}

                {/* Submit button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="deactivate-button"
                >
                    {isLoading ? 'Deactivating...' : 'Deactivate Account'}
                </button>
                
                {/* Cancel button */}
                <button className="deactivate-cancel" onClick={() => navigate('/profile')}>Cancel Deactivation</button>
            </form>

            {/* Confirmation modal */}
            {showModal && (
                <div className="modal-deactivate">
                    <div className="modal-content">
                        <h3>Are you sure you want to deactivate your account?</h3>
                        <div className="button-container">
                            <button className="yes-button" onClick={confirmDeactivation}>YES</button>
                            <button className="no-button" onClick={handleCancelDeactivation}>NO</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deactivation notification */}
            {deactivateNotification.show && (
                <div 
                    className={`deactivate-notification ${deactivateNotification.type === 'success' ? 'deactivate-notification-success' : 'deactivate-notification-error'}`}
                    onAnimationEnd={() => setTimeout(() => setDeactivateNotification({ ...deactivateNotification, show: false }), 3000)}
                >
                    {deactivateNotification.message}
                </div>
            )}
        </div>
    );
};

export default AccountDeactivation;
