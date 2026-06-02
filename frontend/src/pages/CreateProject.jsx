import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { createProject } from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';
import './CreateProject.css';

function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    status: 'active',
    priority: 'medium',
    start_date: '',
    end_date: '',
    budget: '',
    spent: 0,
    site_engineer_name: '',
    site_engineer_phone: '',
    contractor_name: '',
    contractor_company: '',
    contractor_phone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await createProject(form);
      console.log('Created project:', res.data);
      if (res.data && res.data.id) {
        navigate(`/projects/${res.data.id}`);
      } else {
        navigate('/projects');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        const messages = Object.entries(errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        setError(messages);
      } else {
        setError('Failed to create project. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="create-project">

        {/* Header */}
        <div className="create-project-header">
          <button
            className="back-btn"
            onClick={() => navigate('/projects')}
          >
            <FaArrowLeft /> Back to Projects
          </button>
          <h1 className="create-project-title">Create New Project</h1>
          <p className="create-project-subtitle">
            Fill in the details below to create a new construction project
          </p>
        </div>

        {error && <div className="create-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form">

          {/* Basic Info */}
          <div className="form-section">
            <h2 className="form-section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label className="form-label">Project Name *</label>
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  placeholder="e.g. Lekki Phase 2 Bridge"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  name="description"
                  placeholder="Describe the project scope and objectives..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-label">Location *</label>
                <input
                  className="form-input"
                  type="text"
                  name="location"
                  placeholder="e.g. Lekki, Lagos"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="form-section">
            <h2 className="form-section-title">Timeline & Budget</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  className="form-input"
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  className="form-input"
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Budget (₦) *</label>
                <input
                  className="form-input"
                  type="number"
                  name="budget"
                  placeholder="e.g. 50000000"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount Spent (₦)</label>
                <input
                  className="form-input"
                  type="number"
                  name="spent"
                  placeholder="e.g. 0"
                  value={form.spent}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Site Engineer */}
          <div className="form-section">
            <h2 className="form-section-title">Site Engineer</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Engineer Name</label>
                <input
                  className="form-input"
                  type="text"
                  name="site_engineer_name"
                  placeholder="e.g. Emeka Okafor"
                  value={form.site_engineer_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Engineer Phone</label>
                <input
                  className="form-input"
                  type="text"
                  name="site_engineer_phone"
                  placeholder="e.g. 08012345678"
                  value={form.site_engineer_phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Contractor */}
          <div className="form-section">
            <h2 className="form-section-title">Contractor</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Contractor Name</label>
                <input
                  className="form-input"
                  type="text"
                  name="contractor_name"
                  placeholder="e.g. Dangote Construction"
                  value={form.contractor_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  className="form-input"
                  type="text"
                  name="contractor_company"
                  placeholder="e.g. Dangote Group"
                  value={form.contractor_company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contractor Phone</label>
                <input
                  className="form-input"
                  type="text"
                  name="contractor_phone"
                  placeholder="e.g. 08098765432"
                  value={form.contractor_phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}

export default CreateProject;