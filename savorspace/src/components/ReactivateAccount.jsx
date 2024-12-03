import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DeActivateStyles.css';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const AccountReactivation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showPassword, setShowPassword] = useState(false);

    const handleReactivate = async (e) => {
        e.preventDefault();
        setShowModal(true);

    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
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
                    showToast('Account is already active. Please login to continue.', 'success');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }
                throw new Error(data.error || 'Failed to reactivate account');
            }

            // Store tokens 
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            showToast('Account reactivated successfully! Redirecting to login...', 'success');
            setTimeout(() => navigate('/login'), 3000);  
        } catch (error) {
            showToast(error.message, 'error');
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
            {toast.show && (
                <div className={`toast ${toast.type}-toast`}>
                    <div className="toast-content">
                        <div className="toast-icon">
                            {toast.type === 'success' ? '✔' : '❌'}
                        </div>
                        <p>{toast.message}</p>
                    </div>
                </div>
            )}
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
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%'}}>
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
                        }}
                    >
                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>            
                </div>
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
                        <h3>Are you sure you want to reactivate your account?</h3>
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