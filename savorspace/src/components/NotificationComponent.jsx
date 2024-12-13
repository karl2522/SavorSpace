import { useEffect, useRef, useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import WebSocketService from './WebSocketService';
import '../styles/Notification.css';
import { useNavigate } from 'react-router-dom';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { FiFlag } from 'react-icons/fi';
import { FaComment } from 'react-icons/fa';

/*Notification Component*/
const NotificationComponent = ({ username }) => {
    const [notifications, setNotifications] = useState([]);
    const [isNotificationModal, setIsNotificationModal] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    //Notif click
    const handleNotificationClick = async (notification) => {
        try {
            await markAsRead(notification.id);

            if(notification.recipeId) {
                setIsNotificationModal(false);
                console.log("Navigating to recipe:", notification.recipeId);
                navigate(`/community`, {
                    state: {
                        scrollToRecipeId: notification.recipeId,
                        highlightRecipeId: notification.recipeId
                    }
                });
            }
        }catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };
    
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched notifications:', data);
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        if (username) {
            WebSocketService.connect(username, handleNewNotification);
        }

        return () => {
            WebSocketService.disconnect();
        };
    }, [username]);

    const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'FAVORITE':
                return <AiFillHeart className="notification-icon favorite" />;
            case 'REPORT':
                return <FiFlag className="notification-icon report" />;
            case 'COMMENT':
                return <FaComment className="notification-icon comment" />;
            case 'RATING':
                return <AiFillStar className="notification-icon rating" />;
            default:
                return <IoMdNotificationsOutline className="notification-icon" />;
        }
    };

    return (
        <div className="notification-container" ref={notificationRef}>
            <button className="notif-button" onClick={() => setIsNotificationModal(!isNotificationModal)}>
                <IoMdNotificationsOutline size={33} />
                {notifications.filter(n => !n.read).length > 0 && (
                    <span className="notification-badge">
                        {notifications.filter(n => !n.read).length}
                    </span>
                )}
            </button>
            {isNotificationModal && (
                <div className="notification-modal">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type.toLowerCase()}`}
                                onClick={() => handleNotificationClick(notification)}
                                style={{ cursor: notification.read ? 'default' : 'pointer' }}
                            >
                                {getNotificationIcon(notification.type)}
                                <div className="notification-content">
                                    <p className="notification-text">{notification.message}</p>
                                    <span className="notification-time">
                                        {formatTimeAgo(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="notification-item">
                            <p className="notification-text">No notifications</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const formatTimeAgo = (dateArray) => {
    if (!Array.isArray(dateArray)) {
        console.error('Invalid date format:', dateArray);
        return 'Invalid date';
    }

    try {
        const [year, month, day, hour, minute, second] = dateArray;
        const date = new Date(year, month - 1, day, hour, minute, second);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateArray);
            return 'Invalid date';
        }

        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

export default NotificationComponent;