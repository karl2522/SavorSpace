import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchAdmin();
    fetchUsers();
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmin(response.data);
    } catch (error) {
      console.error('Error fetching admin:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
        const userList = response.data.filter(user => user.role === 'USER');
        setUsers(userList);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`/admin/users/${editUser.id}`, editUser, {
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
    <div className="admin-dashboard-container">
      {admin && (
        <div className="admin-info">
          <h2>Admin Information</h2>
          <p><strong>Full Name:</strong> {admin.fullName}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      )}
      <h1>User Management</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div className="edit-form">
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
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={editUser.role}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Update User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;