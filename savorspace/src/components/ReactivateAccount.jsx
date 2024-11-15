import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountReactivation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleReactivate = async (e) => {
        e.preventDefault();
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

            if (!response.ok) {
                throw new Error('Failed to reactivate account');
            }

            const data = await response.json();

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
        }
    };

    return (
        <div className="reactivate-account-container">
            <h2>Reactivate Your Account</h2>
            <form onSubmit={handleReactivate}>
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Reactivating...' : 'Reactivate Account'}
                </button>
            </form>
        </div>
    );
};

export default AccountReactivation;