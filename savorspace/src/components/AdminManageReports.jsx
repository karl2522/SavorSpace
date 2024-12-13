import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfile from '../images/defaultProfiles.png';
import '../styles/AdminManageReports.css';

// AdminManageReports component
const AdminManageReports = () => {
  const [admin, setAdmin] = useState(null);
  const [reportedRecipes, setReportedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [error, setError] = useState(null);

  // Fetch admin and reported recipes on component mount
  useEffect(() => {
    fetchAdmin();
    fetchReportedRecipes();
  }, []);

  // Fetch admin details
  const fetchAdmin = async () => {
    try {
      const token = sessionStorage.getItem('adminToken'); // Get admin token from session storage
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // Fetch admin details from the server
      const response = await axios.get('http://localhost:8080/admin/ad', {
        headers: {
          Authorization: `Bearer ${token}`, // Set authorization header with token
        },
      });

      // Set profile picture URL
      if(response.data.imageURL) {
        const profilePicURL = response.data.imageURL.startsWith('http')
            ? response.data.imageURL // Use full URL if available
            : `http://localhost:8080${response.data.imageURL}`;
        setProfilePic(profilePicURL);
      } else {
        setProfilePic(defaultProfile); // Use default profile picture if no URL is available
      }
      setAdmin(response.data);
    } catch (error) { // Handle errors
      console.error('Error fetching admin:', error);
    }
  };

  // Fetch reported recipes
  const fetchReportedRecipes = async () => {
    try {
      setError(null);
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:8080/admin/reported-recipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Reported Recipes Response:', response.data); // Debug log
      setReportedRecipes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching reported recipes:', error);
      setError('Failed to load reported recipes');
      setReportedRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async (reportId, action) => {
    try {
        const report = reportedRecipes.find(r => r.id === reportId);
        
        if (!report) {
            console.error('Report not found');
            return;
        }

        if (action === 'DELETE') {
            setReportToDelete(report);
            setShowDeleteModal(true);
            return;
        } else {
            const token = sessionStorage.getItem('adminToken');
            await axios.put(
                `http://localhost:8080/admin/reports/${reportId}/status`,
                { status: action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchReportedRecipes();
        }
    } catch (error) {
        console.error('Error handling report action:', error);
    }
};

const handleDeleteConfirm = async () => {
  try {
      const token = sessionStorage.getItem('adminToken');
      await axios.delete(
          `http://localhost:8080/admin/reports/${reportToDelete.id}/recipe/${reportToDelete.recipe.recipeID}`,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      await fetchReportedRecipes();
      setShowDeleteModal(false);
      setReportToDelete(null);
  } catch (error) {
      console.error('Error deleting report:', error);
  }
};

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    navigate('/');
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

  return (
    <div className="amr-admin-reports">
      {/* Keep the sidebar as is */}
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
            <li><Link to="/admin/ManageNotifications">Notifications</Link></li>
            <li><Link to="/admin/Reports" className="active">Reports</Link></li>
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

      <main className="amr-main-content">
        <header className="amr-content-header">
          <div className="amr-header-title">
            <h1>Reported <span>Recipes</span></h1>
            <p>Hello Admin, {admin?.fullName}!</p>
          </div>
        </header>

        <section className="amr-reports-section">
          <div className="amr-reports-header">
            <h2>Reported <span>Recipes</span></h2>
          </div>

          {loading ? (
            <div className="amr-loading">Loading reported recipes...</div>
          ) : !Array.isArray(reportedRecipes) || reportedRecipes.length === 0 ? (
            <div className="amr-no-reports">No reported recipes found.</div>
          ) : (
            <div className="amr-reports-table">
              <table>
                <thead>
                  <tr>
                    <th>Recipe</th>
                    <th>Reported By</th>
                    <th>Reason</th>
                    <th>Report Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportedRecipes.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <div className="amr-recipe-info">
                          <img 
                            src={report.recipe?.imageURL 
                              ? (report.recipe.imageURL.startsWith('http') 
                                ? report.recipe.imageURL 
                                : `http://localhost:8080${report.recipe.imageURL}`)
                              : defaultProfile}
                            alt={report.recipe?.title || "Recipe"}
                            className="amr-recipe-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultProfile;
                            }}
                          />
                          <span>{report.recipe?.title || "Unknown Recipe"}</span>
                        </div>
                      </td>
                      <td>{report.reportedBy?.fullName}</td>
                      <td>{report.reason}</td>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        <span className={`amr-status-badge ${report.status.toLowerCase()}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="amr-action-buttons">
                        {report.status === 'PENDING' && (
                          <>
                            <button 
                              className="amr-action-button approve"
                              onClick={() => handleActionClick(report.id, 'RESOLVED')}
                            >
                              Dismiss
                            </button>
                            <button 
                              className="amr-action-button delete"
                              onClick={() => handleActionClick(report.id, 'DELETE')}
                            >
                              Remove Recipe
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {showDeleteModal && (
        <div className="amr-modal-overlay">
          <div className="amr-modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this recipe?</p>
            <p>This action cannot be undone.</p>
            <div className="amr-modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setReportToDelete(null);
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
    </div>
  );
};

export default AdminManageReports;