import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfile from '../images/defaultProfiles.png';
import '../styles/AdminManageComments.css';

const AdminManageComments = () => {
  const [admin, setAdmin] = useState(null);
  const [comments, setComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    fetchAdmin();
    fetchComments();
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found in sessionStorage');
        return;
      }

      const response = await axios.get('http://localhost:8080/admin/ad', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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

  const fetchComments = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found in sessionStorage');
        return;
      }

      // Get all recipes first
      const recipesResponse = await axios.get('http://localhost:8080/recipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Fetch comments for each recipe
      const allComments = [];
      for (const recipe of recipesResponse.data) {
        const commentsResponse = await axios.get(`http://localhost:8080/api/comments/recipe/${recipe.recipeID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        allComments.push(...commentsResponse.data);
      }

      setComments(allComments.map(comment => ({
        ...comment,
        userImageUrl: comment.userImageURL ? `http://localhost:8080${comment.userImageURL}` : defaultProfile,
        username: comment.user?.username || comment.username || 'Unknown User' // Use username from User entity
      })));

    } catch (error) {
      console.error('Error fetching comments:', error);
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
      await axios.delete(`http://localhost:8080/api/comments/${commentToDelete.commentID}`, {
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
            <p>Are you sure you want to delete this comment?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={handleDeleteConfirm}
              >
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
            <li><Link to="/admin/ManageComments" className="active">User Comments</Link></li>
            <li><Link to="/admin/ManageNotifications">Notifications</Link></li>
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
            <h1>User <span>Comments</span></h1>
            <p>Hello Admin, {admin?.fullName}!</p>
          </div>
        </header>

        <section className="comments-section">
          <div className="comments-header">
            <h2>User <span>Comments</span></h2>
          </div>

          <div className="comments-table">
            <table>
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Account Name</th>
                  <th>Comment</th>
                  <th>Commented At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
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
        </section>
      </main>
    </div>
  );
};

export default AdminManageComments;