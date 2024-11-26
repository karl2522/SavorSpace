import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfile from '../images/defaultProfiles.png';
import '../styles/AdminManageAccounts.css';

const AdminManageAccounts = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserTODelete] = useState(null);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');


  useEffect(() => {
    fetchAdmin();
    fetchUsers();
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found in sessionStorage');
        return;
      }
      console.log('Admin token:', token);
  
      const response = await axios.get('http://localhost:8080/admin/ad', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Admin response:', response.data);

      if(response.data.imageURL) {
        const profilePicURL = response.data.imageURL.startsWith('http')
            ? data.imageURL 
            : `http://localhost:8080${response.data.imageURL}`;
        setProfilePic(profilePicURL);
      }else {
        setProfilePic(defaultProfile);
      }
      setAdmin(response.data);
    } catch (error) {
      console.error('Error fetching admin:', error);

      if(error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found in sessionStorage');
        return;
      }
  
      const activeResponse = await axios.get('http://localhost:8080/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const deleteResponse = await axios.get('http://localhost:8080/admin/users/deleted', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      if (activeResponse.headers['content-type'] && activeResponse.headers['content-type'].includes('application/json')) {
        const activeUserList = activeResponse.data.filter(user => user.role === 'USER').map(user => ({
          ...user,
          profilePicURL: user.imageURL
            ? user.imageURL.startsWith('http')
              ? user.imageURL
              : `http://localhost:8080${user.imageURL}`
            : defaultProfile,
        }));
        setUsers(activeUserList);
      }


      if (deleteResponse.headers['content-type'] && deleteResponse.headers['content-type'].includes('application/json')) {
        const deleteUserList = deleteResponse.data.filter(user => user.role === 'USER').map(user => ({
          ...user,
          profilePicURL: user.imageURL
            ? user.imageURL.startsWith('http')
              ? user.imageURL
              : `http://localhost:8080${user.imageURL}`
            : defaultProfile,
        }));
        setDeletedUsers(deleteUserList);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }finally {
      setLoading(false);
    }
  };

  

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    navigate('/');
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleDeleteClick = (user) => {
    setUserTODelete(user);
    setShowDeleteModal(true);
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`http://localhost:8080/admin/users/${userToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setDeletedUsers([...deletedUsers, userToDelete]);
      setShowDeleteModal(false);
      setUserTODelete(null);
    }catch(error) {
      console.error('Error deleting user:', error);
    }
  };


  const handleRestore = async (userId) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.put(`http://localhost:8080/admin/users/${userId}/restore`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const restoredUser = deletedUsers.find(user => user.id === userId);
      setDeletedUsers(deletedUsers.filter(user => user.id !== userId));
      setUsers([...users, restoredUser]);
    }catch(error) {
      console.error('Error restoring user:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.put(`http://localhost:8080/admin/users/${editUser.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.map(user => (user.id === editUser.id ? editUser : user)));
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-accounts">
      {showDeleteModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete user {userToDelete?.fullName}?</p>
      <p>This action will move the user to the recycle bin.</p>
      <div className="modal-actions">
        <button 
          className="cancel-button"
          onClick={() => {
            setShowDeleteModal(false);
            setUserTODelete(null);
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
            <li><Link to="/admin/dashboard" >Dashboard</Link></li>
            <li><Link to="/admin/ManageUser" className="active">User Account</Link></li>
            <li><Link to="/admin/ManagePosts">User Posts</Link></li>
            <li><Link to="/admin/ManageComments">User Comments</Link></li>
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
            <h1>User <span>Account</span></h1>
            <p>Hello Admin, {admin?.fullName}!</p>
          </div>
        </header>
        <section className="users-section">
          <div className="users-header">
            <h2>SavorSpace <span>Users</span></h2>
            <button 
              className="recycle-bin-toggle"
              onClick={() => setShowRecycleBin(!showRecycleBin)}
            >
              {showRecycleBin ? 'View Active Users' : 'View Recycle Bin'}
            </button>
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Profile Picture</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showRecycleBin ? deletedUsers : users).map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="profile-picture">
                        <img src={user.profilePicURL || defaultProfile} alt={`${user.imageURL}'s profile`} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultProfile;
                            }}                            
                        />
                      </div>
                    </td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {showRecycleBin ? (
                        <button
                          className="action-button restore"
                          onClick={() => handleRestore(user.id)}
                        >
                          Restore
                        </button>
                      ) : (
                        <>
                         <button
                            className="action-button edit"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button 
                            className="action-button delete"
                            onClick={() => handleDeleteClick(user)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      {editUser && (
        <div className="edit-user-modal">
          <div className="edit-user-content">
            <h2>Edit User</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={editUser.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">Update User</button>
                <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageAccounts;