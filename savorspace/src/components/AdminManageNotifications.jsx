import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfile from '../images/defaultProfiles.png';
import '../styles/AdminManageComments.css';

const AdminManageNotifications = () => {
  const [admin, setAdmin] = useState(null);
  const [comments, setComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');
  const [flaggedComments, setFlaggedComments] = useState([]);

  useEffect(() => {
    fetchAdmin();
    fetchFlaggedComments();
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/admin/ad', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.data.imageURL) {
        const profilePicURL = response.data.imageURL.startsWith('http')
            ? response.data.imageURL 
            : `http://localhost:8080${response.data.imageURL}`;
        setProfilePic(profilePicURL);
      } else {
        setProfilePic(defaultProfile);
      }
      setAdmin(response.data);
    } catch (error) {
      console.error('Error fetching admin:', error);
    }
  };

  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return 'No date available';
    try {
      const date = new Date(
        dateArray[0],    // year
        dateArray[1] - 1,// month (0-11)
        dateArray[2],    // day
        dateArray[3],    // hour
        dateArray[4],    // minute
        dateArray[5],    // second
        dateArray[6] / 1000000 // convert nanoseconds to milliseconds
      );

      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const fetchFlaggedComments = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/admin/flagged-comments', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setFlaggedComments(response.data.map(comment => ({
        ...comment,
        userImageUrl: comment.userImageURL ? `http://localhost:8080${comment.userImageURL}` : defaultProfile,
        username: comment.username || 'Unknown User'
      })));
    } catch (error) {
      console.error('Error fetching flagged comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    navigate('/');
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`http://localhost:8080/admin/comments/${commentToDelete.commentID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter(comment => comment.commentID !== commentToDelete.commentID));
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="admin-comments">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this flagged comment?</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-button" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="logo">
          <img src="/src/images/savorspaceLogo.png" alt="SavorSpace Logo" className="logo-image" />
          <div className="logo-text">
            <h2>SavorSpace</h2>
            <p>Admin</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/ManageUser">User Account</Link></li>
            <li><Link to="/admin/ManagePosts">User Posts</Link></li>
            <li><Link to="/admin/ManageComments">User Comments</Link></li>
            <li><Link to="/admin/ManageNotifications" className="active">Notifications</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
        {admin && (
          <div className="admin-profile">
            <img src={profilePic || defaultProfile} alt="Admin Avatar" className="admin-avatar" />
            <h3>{admin.fullName}</h3>
            <p>{admin.email}</p>
          </div>
        )}
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Flagged <span>Comments</span></h1>
            <p>Hello Admin, {admin?.fullName}!</p>
          </div>
        </header>

        <section className="comments-section">
          <div className="comments-header">
            <h2>Flagged <span>Comments</span></h2>
          </div>

          {loading ? (
            <div className="loading">Loading flagged comments...</div>
          ) : flaggedComments.length === 0 ? (
            <div className="no-comments">No flagged comments found.</div>
          ) : (
            <div className="comments-table">
              <table>
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Account Name</th>
                    <th>Comment</th>
                    <th>Flagged At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedComments.map((comment) => (
                    <tr key={comment.commentID}>
                      <td>
                        <div className="user-image">
                          <img 
                            src={comment.userImageUrl} 
                            alt={comment.username}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultProfile;
                            }}
                          />
                        </div>
                      </td>
                      <td>{comment.username}</td>
                      <td className="comment-content">{comment.content}</td>
                      <td>{formatDate(comment.createdAt)}</td>
                      <td>
                        <button 
                          className="action-button delete"
                          onClick={() => handleDeleteClick(comment)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminManageNotifications;