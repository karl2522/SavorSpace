import axios from 'axios';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import defaultProfile from '../images/defaultProfiles.png';
import '../styles/AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  RadialLinearScale,
  ArcElement,
  Legend
);



const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [userActivityData, setUserActivityData] = useState({
    labels: [],
    datasets: []
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [dailyActivityData, setDailyActivityData] = useState({
    labels: [],
    datasets: []
  });

  const [metricsData, setMetricsData] = useState({
    labels: [],
    datasets: []
  });




  useEffect(() => {
    fetchAdmin();
    fetchUsers();
    fetchChartData();
    fetchDailyActivity();
    fetchMetricsData();
  }, []);


   const fetchMetricsData = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:8080/admin/user-metrics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Option 1: Radar Chart Data
      const radarData = {
        labels: response.data.labels,
        datasets: [{
          label: 'Platform Usage',
          data: response.data.metrics,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(75, 192, 192)'
        }]
      };

      // Option 2: Polar Area Chart Data
      const polarData = {
        labels: response.data.labels,
        datasets: [{
          data: response.data.metrics,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)'
          ],
          borderWidth: 1
        }]
      };

      // Option 3: Doughnut Chart Data
      const doughnutData = {
        labels: response.data.labels,
        datasets: [{
          data: response.data.metrics,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: 'white',
          borderWidth: 2
        }]
      };

      setMetricsData(radarData); // or radarData or polarData
    } catch (error) {
      console.error('Error fetching metrics data:', error);
    }
  };

  const metricsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Platform Overview'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const fetchDailyActivity = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:8080/admin/daily-activity', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDailyActivityData({
        labels: response.data.timeLabels,
        datasets: [
          {
            label: 'New Recipes',
            data: response.data.recipeCreations,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            borderRadius: 5,
            categoryPercentage: 0.8,
            barPercentage: 0.9
          },
          {
            label: 'Comments',
            data: response.data.commentActivity,
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            borderRadius: 5,
            categoryPercentage: 0.8,
            barPercentage: 0.9
          },
          {
            label: 'Ratings',
            data: response.data.ratingActivity,
            backgroundColor: 'rgba(53, 162, 235, 0.8)',
            borderColor: 'rgb(53, 162, 235)',
            borderWidth: 1,
            borderRadius: 5,
            categoryPercentage: 0.8,
            barPercentage: 0.9
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching daily activity:', error);
    }
  };

  const dailyActivityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '24-Hour Activity Timeline'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (24h)'
        },
        grid: {
          display: false
        }
      },
      y: {
        stacked: false, // Changed to false for grouped bars
        title: {
          display: true,
          text: 'Number of Activities'
        },
        min: 0,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  const fetchChartData = async () => {
     try {
       const token = sessionStorage.getItem('adminToken');
       const response = await axios.get('http://localhost:8080/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
       });

       setChartData({
         labels: response.data.dates,
         datasets: [
           {
              label: 'New Users',
              data: response.data.userCounts,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
           },
           {
              label: 'New Recipes',
              data: response.data.recipeCounts,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
           },
           {
              label: 'New Comments',
              data: response.data.commentCounts,
              borderColor: 'rgb(53, 162, 235)',
              tension: 0.1
           }
         ]
       });
     }catch (error) {
       console.error('Error fetching chart data:', error);
     }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display : true,
        text: 'Platform Activity',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };


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
            ? response.data.imageURL 
            : `http://localhost:8080${response.data.imageURL}`;
        setProfilePic(profilePicURL);
      }else {
        setProfilePic(defaultProfile);
      }
      setAdmin(response.data);
      setRole(response.data.role);
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
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="logo-admin">
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
            <div className="admin-avatar">
              <img src={profilePic || defaultProfile} alt="Admin Avatar" />
            </div>
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
            <h2>{users.length}</h2>
            <p>Active <span>Users</span></p>
          </div>
          <div className="stat-card">
            <h2>{chartData.datasets?.[1]?.data?.reduce((a, b) => a + b , 0) || 0}</h2>
            <p>Recipes <span>Posted</span></p>
          </div>
          <div className="stat-card">
            <h2>{chartData.datasets?.[2]?.data?.reduce((a, b) => a + b, 0) || 0}</h2>
            <p>User <span>Comments</span></p>
          </div>
        </section>
        <section className="charts-container">
          <div className="chart">
            <h3>Platform Activity</h3>
            {chartData.labels.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
          <div className="chart">
            <h3>24-Hour Activity Timeline</h3>
            {dailyActivityData.labels.length > 0 ? (
              <Bar data={dailyActivityData} options={dailyActivityOptions} />
            ) : (
              <p>Loading daily activity data...</p>
            )}
          </div>
          <div className="chart">
            <h3>Platform Metrics</h3>
            {metricsData.labels.length > 0 ? (
              <Radar data={metricsData} options={metricsOptions} />
            ) : (
              <p>Loading daily activity data...</p>
            )}
          </div>
        </section>
      </main> 
    </div>
  );
};

export default AdminDashboard;