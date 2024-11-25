import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DeActivateStyles.css';

const AccountReactivation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleReactivate = async (e) => {
        e.preventDefault();
        setShowModal(true);

    };


    const confirmReactivation = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/reactivate', {
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
                if(data.error === "Account is already active") {
                    alert('Account is already active. Please login to continue.');
                    navigate('/login');
                    return;
                }
                throw new Error(data.error || 'Failed to reactivate account');
            }

            // Store tokens
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Account reactivated successfully! Please login to continue.');
            navigate('/login');
            
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
            setShowModal(false);
        }
    };

    const handleCancelReactivation = () => {
        setShowModal(false);
    }

    return (
        <div className="reactivate-account-container">
            <h2>Reactivate Your Account</h2>
            <form onSubmit={handleReactivate}>
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
                <button className="reactivate-btn1" type="submit" disabled={isLoading}>
                    {isLoading ? 'Reactivating...' : 'Reactivate Account'}
                </button>
                <button className="reactivate-cancel" onClick={() => navigate('/login')}>Cancel Reactivation</button>
            </form>
            {showModal && (
                <div className="modal-deactivate">
                    <div className="modal-content">
                        <h3>Are you sure you want to deactivate your account?</h3>
                        <div className="button-container">
                            <button className="yes-button-reactivate" onClick={confirmReactivation}>YES</button>
                            <button className="no-button-reactivate" onClick={handleCancelReactivation}>NO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountReactivation;