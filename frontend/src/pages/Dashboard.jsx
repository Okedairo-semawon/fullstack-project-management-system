import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProjects } from '../services/api';
import {
  FaProjectDiagram,
  FaCheckCircle,
  FaClock,
  FaPauseCircle,
  FaPlus,
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

const safeProjects = Array.isArray(projects) ? projects : [];

const stats = {
  total: safeProjects.length,
  active: safeProjects.filter(p => p.status === 'active').length,
  completed: safeProjects.filter(p => p.status === 'completed').length,
  on_hold: safeProjects.filter(p => p.status === 'on_hold').length,
};
  const pieData = [
    { name: 'Active', value: stats.active },
    { name: 'Completed', value: stats.completed },
    { name: 'On Hold', value: stats.on_hold },
  ];

  const barData = safeProjects.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    Budget: parseFloat(p.budget),
    Spent: parseFloat(p.spent),
  }));

  const PIE_COLORS = ['#0fbcf9', '#0be881', '#f8b739'];

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-loading">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back — here's what's happening on your sites
            </p>
          </div>
          <button
            className="dashboard-new-btn"
            onClick={() => navigate('/projects/create')}
          >
            <FaPlus /> New Project
          </button>
        </div>

        {/* Stat Cards */}
        <div className="dashboard-stats">
          <div className="stat-card stat-card--total">
            <div className="stat-card-icon">
              <FaProjectDiagram />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-number">{stats.total}</span>
              <span className="stat-card-label">Total Projects</span>
            </div>
          </div>

          <div className="stat-card stat-card--active">
            <div className="stat-card-icon">
              <FaClock />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-number">{stats.active}</span>
              <span className="stat-card-label">Active</span>
            </div>
          </div>

          <div className="stat-card stat-card--completed">
            <div className="stat-card-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-number">{stats.completed}</span>
              <span className="stat-card-label">Completed</span>
            </div>
          </div>

          <div className="stat-card stat-card--hold">
            <div className="stat-card-icon">
              <FaPauseCircle />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-number">{stats.on_hold}</span>
              <span className="stat-card-label">On Hold</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="dashboard-charts">
          <div className="chart-card">
            <h3 className="chart-title">Budget vs Spent</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Budget" fill="#0fbcf9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Project Status</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="dashboard-recent">
          <div className="recent-header">
            <h3 className="chart-title">Recent Projects</h3>
            <button
              className="recent-view-all"
              onClick={() => navigate('/projects')}
            >
              View all
            </button>
          </div>

          <div className="recent-table-wrapper">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Progress</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                {safeProjects.slice(0, 5).map(project => (
                  <tr
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="recent-table-row"
                  >
                    <td className="recent-project-name">{project.name}</td>
                    <td>{project.location}</td>
                    <td>
                      <span className={`status-badge status-badge--${project.status}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-badge--${project.priority}`}>
                        {project.priority}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${project.completion_percentage}%` }}
                          />
                        </div>
                        <span className="progress-text">
                          {project.completion_percentage}%
                        </span>
                      </div>
                    </td>
                    <td>₦{Number(project.budget).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;