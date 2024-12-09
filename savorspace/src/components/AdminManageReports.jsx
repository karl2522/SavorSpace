import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfile from '../images/defaultProfiles.png';
import '../styles/AdminManageComments.css';

const AdminManageReports = () => {
  const [admin, setAdmin] = useState(null);
  const [reportedRecipes, setReportedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmin();
    fetchReportedRecipes();
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
        const token = sessionStorage.getItem('adminToken');
        const report = reportedRecipes.find(r => r.id === reportId);
        
        if (!report) {
            console.error('Report not found');
            return;
        }

        if (action === 'DELETE') {
            if (!report.recipe || !report.recipe.recipeID) {
                console.error('Recipe information not found');
                return;
            }

            // Use the new combined endpoint
            await axios.delete(
                `http://localhost:8080/admin/reports/${reportId}/recipe/${report.recipe.recipeID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } else {
            // For non-delete actions, just update the status
            await axios.put(
                `http://localhost:8080/admin/reports/${reportId}/status`,
                { status: action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }
        
        // Refresh the reports list
        await fetchReportedRecipes();
    } catch (error) {
        console.error('Error handling report action:', error);
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
    <div className="admin-reports">
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

      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Reported <span>Recipes</span></h1>
            <p>Hello Admin, {admin?.fullName}!</p>
          </div>
        </header>

        <section className="reports-section">
          <div className="reports-header">
            <h2>Reported <span>Recipes</span></h2>
          </div>

           {loading ? (
            <div className="loading">Loading reported recipes...</div>
            ) : !Array.isArray(reportedRecipes) || reportedRecipes.length === 0 ? (
            <div className="no-reports">No reported recipes found.</div>
            ) : (
            <div className="reports-table">
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
                        <div className="recipe-info">
                          <img 
                            src={report.recipe?.imageURL 
                                ? (report.recipe.imageURL.startsWith('http') 
                                   ? report.recipe.imageURL 
                                   : `http://localhost:8080${report.recipe.imageURL}`)
                                : defaultProfile}
                            alt={report.recipe?.title || "Recipe"}
                            className="recipe-thumbnail"
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
                        <span className={`status-badge ${report.status.toLowerCase()}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        {report.status === 'PENDING' && (
                          <>
                            <button 
                              className="action-button approve"
                              onClick={() => handleActionClick(report.id, 'RESOLVED')}
                            >
                              Dismiss
                            </button>
                            <button 
                              className="action-button delete"
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
    </div>
  );
};

export default AdminManageReports;