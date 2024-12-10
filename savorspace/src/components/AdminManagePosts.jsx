import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfile from '../images/defaultProfiles.png';
import { Avatar } from '@mui/material';
import '../styles/AdminManagePosts.css';

const AdminManagePosts = () => {
  const [admin, setAdmin] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    fetchAdmin();
    fetchPosts();
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

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found in sessionStorage');
        return;
      }

      const response = await axios.get('http://localhost:8080/recipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 0,
          size: 100
        }
      });

      setPosts(response.data.map(post => ({
        ...post,
        imageUrl: post.imageURL ? `http://localhost:8080${post.imageURL}` : null,
        username: post.user?.username || 'Unknown User'
      })));


    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    navigate('/');
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`http://localhost:8080/admin/recipes/${postToDelete.recipeID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post.recipeID !== postToDelete.recipeID));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="admin-posts">
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontWeight: 500 }}>Confirm Delete</h2>
            <p>Are you sure you want to delete this recipe post?</p>
            <p style={{ fontWeight: 500 }}>Recipe Title: {postToDelete?.title}</p>
            <p style={{ fontWeight: 500 }}>Posted by: {postToDelete?.user?.username || 'Unknown User'}</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setPostToDelete(null);
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
            <li><Link to="/admin/ManagePosts" className="active">User Posts</Link></li>
            <li><Link to="/admin/ManageComments">User Comments</Link></li>
            <li><Link to="/admin/ManageNotifications">Notifications</Link></li>
            <li><Link to="/admin/Reports">Reports</Link></li>
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
            <h1>Recipe <span>Posts</span></h1>
            <p>Hello Admin, {admin?.fullName}!</p>
          </div>
        </header>

        <section className="posts-section">
          <div className="posts-header">
            <h2>Recipe <span>Posts</span></h2>
          </div>

          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Recipe Image</th>
                  <th>Username</th>
                  <th>Recipe Title</th>
                  <th>Posted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.recipeID}>
                    <td>
                      <Avatar 
                        src={post.imageUrl} 
                        alt={post.title}
                        sx={{ width: 56, height: 56 }}
                        imgProps={{
                          onError: (e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/images/default-recipe.jpg';
                          }
                        }}
                      />
                    </td>
                    <td>{post.user?.username || 'Unknown User'}</td>
                    <td>{post.title}</td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="action-button delete"
                        style={{ backgroundColor: 'red', color: 'white' }}
                        onClick={() => handleDeleteClick(post)}
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

export default AdminManagePosts;