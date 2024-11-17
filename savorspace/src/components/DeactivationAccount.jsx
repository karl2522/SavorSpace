import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DeActivateStyles.css';

const AccountDeactivation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleDeactivate = async (e) => {
        e.preventDefault();
        
        setShowModal(true);  // Show the modal after the user submits the form
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

            // Show success message
            alert(data.message);
            
            // Redirect to login page
            navigate('/login');

        } catch (error) {
            setError(error.message);
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
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
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
        </div>
    );
};

export default AccountDeactivation;
