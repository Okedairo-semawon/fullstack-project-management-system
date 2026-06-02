import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProjects, deleteProject } from '../services/api';
import {
  FaPlus, FaSearch, FaMapMarkerAlt,
  FaCalendarAlt, FaTrash, FaEye,
} from 'react-icons/fa';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const filters = {};
        if (search) filters.search = search;
        if (statusFilter) filters.status = statusFilter;
        if (priorityFilter) filters.priority = priorityFilter;
        const res = await getProjects(filters);
        setProjects(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, [search, statusFilter, priorityFilter]);


  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  return (
    <Layout>
      <div className="projects">

        {/* Header */}
        <div className="projects-header">
          <div>
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">
              {projects.length} project{projects.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            className="projects-new-btn"
            onClick={() => navigate('/projects/create')}
          >
            <FaPlus /> New Project
          </button>
        </div>

        {/* Filters */}
        <div className="projects-filters">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Project Cards */}
        {loading ? (
          <div className="projects-loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">
            <h3>No projects found</h3>
            <p>Try adjusting your filters or create a new project</p>
            <button
              className="projects-new-btn"
              onClick={() => navigate('/projects/create')}
            >
              <FaPlus /> Create First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Card Header */}
                <div className="project-card-header">
                  <div className="project-card-badges">
                    <span className={`status-badge status-badge--${project.status}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className={`priority-badge priority-badge--${project.priority}`}>
                      {project.priority}
                    </span>
                  </div>
                  <button
                    className="project-card-delete"
                    onClick={(e) => handleDelete(e, project.id)}
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Card Body */}
                <h3 className="project-card-name">{project.name}</h3>

                <div className="project-card-meta">
                  <span className="project-card-meta-item">
                    <FaMapMarkerAlt /> {project.location}
                  </span>
                  <span className="project-card-meta-item">
                    <FaCalendarAlt /> {new Date(project.end_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Progress */}
                <div className="project-card-progress">
                  <div className="project-card-progress-header">
                    <span>Progress</span>
                    <span>{project.completion_percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${project.completion_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="project-card-budget">
                  <div className="project-card-budget-item">
                    <span className="budget-label">Budget</span>
                    <span className="budget-value">
                      ₦{Number(project.budget).toLocaleString()}
                    </span>
                  </div>
                  <div className="project-card-budget-item">
                    <span className="budget-label">Spent</span>
                    <span className="budget-value budget-spent">
                      ₦{Number(project.spent).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="project-card-footer">
                  <span className="project-card-tasks">
                    {project.task_count} task{project.task_count !== 1 ? 's' : ''}
                  </span>
                  <span className="project-card-view">
                    <FaEye /> View details
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Projects;