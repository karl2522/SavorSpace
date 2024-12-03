import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DeActivateStyles.css';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const AccountDeactivation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [deactivateNotification, setDeactivateNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    const handleDeactivate = async (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const confirmDeactivation = async () => {
        setIsLoading(true);
        setError('');

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

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            // Show success notification
            setDeactivateNotification({
                show: true,
                message: data.message || 'Account deactivated successfully',
                type: 'success'
            });
            
            // Navigate to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setError(error.message);
            setDeactivateNotification({
                show: true,
                message: error.message,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
            setShowModal(false);  
        }
    };

    const handleCancelDeactivation = () => {
        setShowModal(false); 
    };

    return (
        <div className="deactivate-account-container">
            <h2>Deactivate Your Account</h2>
            <div className="warning-message">
                <p>⚠️ Warning: Deactivating your account will:</p>
                <ul>
                    <li>Temporarily disable your access to the account</li>
                    <li>Hide your profile from other users</li>
                    <li>Require reactivation to access your account again</li>
                </ul>
            </div>
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
                {error && <div className="error-message">{error}</div>}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="deactivate-button"
                >
                    {isLoading ? 'Deactivating...' : 'Deactivate Account'}
                </button>
                <button className="deactivate-cancel" onClick={() => navigate('/profile')}>Cancel Deactivation</button>
            </form>
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
