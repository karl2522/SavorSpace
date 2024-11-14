import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState('');

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
  
      const response = await axios.get('http://localhost:8080/admin/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setAdmin(response.data);
      setRole(response.data.role);
    } catch (error) {
      console.error('Error fetching admin:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found in sessionStorage');
        return;
      }
      console.log('Admin token:', token);
  
      const response = await axios.get('http://localhost:8080/admin/users', {
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
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(`http://localhost:8080/admin/users/${userId}`, {
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

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
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
            <li><Link to="/admin/dashboard" className="active">Dashboard</Link></li>
            <li><Link to="/admin/ManageUser">User Account</Link></li>
            <li><Link to="/admin/ManagePosts">User Posts</Link></li>
            <li><Link to="/admin/ManageComments">User Comments</Link></li>
            <li><Link to="/admin/ManageNotifications">Notifications</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
        {admin && (
          <div className="admin-profile">
            <img src="/placeholder.svg?height=80&width=80" alt="Admin Avatar" className="admin-avatar" />
            <h3>{admin.fullName}</h3>
            <p>{admin.email}</p>
          </div>
        )}
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Hello Admin, {admin?.fullName}!</p>
        </header>
        <section className="stats-container">
          <div className="stat-card">
            <h2>23</h2>
            <p>Active <span>Users</span></p>
          </div>
          <div className="stat-card">
            <h2>53</h2>
            <p>Recipes <span>Posted</span></p>
          </div>
          <div className="stat-card">
            <h2>34</h2>
            <p>User <span>Comments</span></p>
          </div>
        </section>
        <section className="charts-container">
          <div className="chart">
            <h3>New User Activity</h3>
            <img src="/src/images/multi-series-line-chart.png" alt="New User Activity Chart" />
          </div>
          <div className="chart">
            <h3>Recipe Posting Trends</h3>
            <img src="/src/images/multi-series-line-chart.png" alt="Recipe Posting Trends Chart" />
          </div>
        </section>
      </main> 
    </div>
  );
};

export default AdminDashboard;