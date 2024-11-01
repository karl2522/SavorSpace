import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, ChefHat, Utensils } from 'lucide-react';
import axios from 'axios';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const [admins, setAdmins] = useState([]);
    const [admin, setAdmin] = useState({ id: '', username: '', email: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
            alert('Failed to fetch admins. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/admins/${admin.id}`, admin);
                alert('Admin updated!');
            } else {
                await axios.post('http://localhost:8080/api/admins', admin);
                alert('Admin created!');
            }
            setAdmin({ id: '', username: '', email: '', password: '' });
            setIsEditing(false);
            fetchAdmins();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        }
    };

    const handleEdit = (admin) => {
        setAdmin(admin);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admins/${id}`);
                alert('Admin deleted!');
                fetchAdmins();
            } catch (error) {
                console.error('Error deleting admin:', error);
                alert('Failed to delete admin. Please try again.');
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="sidebar">
                <div className="sidebar-content">
                    <div className="icon-container">
                        <ChefHat className="icon" size={32} />
                        <Utensils className="icon" size={32} />
                    </div>
                    <h1>ADMIN<br />Management</h1>
                    <p>Manage your SavorSpace admin accounts here</p>
                </div>
            </div>
            
            <div className="main-content">
                <div className="admin-form-card">
                    <h2>Create Admin</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={admin.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={admin.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={admin.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">
                            {isEditing ? 'Update Admin' : 'Create Admin'}
                        </button>
                    </form>
                </div>

                <div className="admin-list-card">
                    <h2>Admin List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>USERNAME</th>
                                <th>EMAIL</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.adminid}>
                                    <td>{admin.username}</td>
                                    <td>{admin.email}</td>
                                    <td className="actions">
                                        <button onClick={() => handleEdit(admin)} className="icon-button edit">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(admin.adminid)} className="icon-button delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;