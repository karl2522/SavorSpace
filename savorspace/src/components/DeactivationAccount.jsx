import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountDeactivation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleDeactivate = async (e) => {
        e.preventDefault();
        
        // Show confirmation dialog
        const confirmed = window.confirm(
            "Are you sure you want to deactivate your account? You won't be able to access your account until you reactivate it."
        );

        if (!confirmed) {
            return;
        }

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
        }
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
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
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
            </form>
        </div>
    );
};

export default AccountDeactivation;