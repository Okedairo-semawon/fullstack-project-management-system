import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  getProject, getProjectStats, getTasks,
  getMilestones, createTask, createMilestone,
  updateTask, updateMilestone, deleteTask, deleteMilestone,
} from '../services/api';
import {
    FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt,
    FaHardHat, FaBuilding, FaPhone,
    FaPlus, FaTrash, FaCheck,
} from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // New task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', due_date: '',
    status: 'todo', priority: 'medium', project: id,
  });

  // New milestone form
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '', due_date: '', project: id,
  });

  // useEffect(() => {
  //   const fetchAll = async () => {
  //     try {
  //       const [projectRes, statsRes, tasksRes, milestonesRes] = await Promise.all([
  //         getProject(id),
  //         getProjectStats(id),
  //         getTasks({ project: id }),
  //         getMilestones({ project: id }),
  //       ]);
  //       setProject(projectRes.data);
  //       setStats(statsRes.data);
  //       setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
  //       setMilestones(Array.isArray(milestonesRes.data) ? milestonesRes.data : []);
  //     } catch (err) {
  //       console.error('Full error:', err);
  //       console.error('Error response:', err.response?.data);
  //       console.error('Error status:', err.response?.status);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchAll();
  // }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projectRes, tasksRes, milestonesRes] = await Promise.all([
          getProject(id),
          getTasks({ project: id }),
          getMilestones({ project: id }),
        ]);
        setProject(projectRes.data);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setMilestones(Array.isArray(milestonesRes.data) ? milestonesRes.data : []);
  
        // Fetch stats separately so it doesn't crash everything
        try {
          const statsRes = await getProjectStats(id);
          setStats(statsRes.data);
        } catch (statsErr) {
          console.log('Stats not available, calculating locally');
          // Calculate stats locally from tasks instead
          const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
          setStats({
            total_tasks: tasks.length,
            todo: tasks.filter(t => t.status === 'todo').length,
            in_progress: tasks.filter(t => t.status === 'in_progress').length,
            done: tasks.filter(t => t.status === 'done').length,
            completion_percentage: tasks.length === 0 ? 0 :
              Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100),
            budget: projectRes.data.budget,
            spent: projectRes.data.spent,
            budget_remaining: projectRes.data.budget_remaining,
            total_milestones: Array.isArray(milestonesRes.data) ? milestonesRes.data.length : 0,
            completed_milestones: Array.isArray(milestonesRes.data) ?
              milestonesRes.data.filter(m => m.is_completed).length : 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch project:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);
  

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await createTask(taskForm);
      setTasks([...tasks, res.data]);
      setTaskForm({
        title: '', description: '', due_date: '',
        status: 'todo', priority: 'medium', project: id,
      });
      setShowTaskForm(false);
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      const res = await createMilestone(milestoneForm);
      setMilestones([...milestones, res.data]);
      setMilestoneForm({ title: '', due_date: '', project: id });
      setShowMilestoneForm(false);
    } catch (err) {
      alert('Failed to create milestone');
    }
  };

  const handleTaskStatus = async (task) => {
    const nextStatus = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };
    try {
      const res = await updateTask(task.id, {
        ...task, status: nextStatus[task.status],
      });
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleMilestoneToggle = async (milestone) => {
    try {
      const res = await updateMilestone(milestone.id, {
        ...milestone, is_completed: !milestone.is_completed,
      });
      setMilestones(milestones.map(m =>
        m.id === milestone.id ? res.data : m
      ));
    } catch (err) {
      alert('Failed to update milestone');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (window.confirm('Delete this milestone?')) {
      try {
        await deleteMilestone(milestoneId);
        setMilestones(milestones.filter(m => m.id !== milestoneId));
      } catch (err) {
        alert('Failed to delete milestone');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="detail-loading">Loading project...</div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="detail-loading">Project not found.</div>
      </Layout>
    );
  }

  const pieData = stats ? [
    { name: 'To Do', value: stats.todo },
    { name: 'In Progress', value: stats.in_progress },
    { name: 'Done', value: stats.done },
  ] : [];

  const PIE_COLORS = ['#f8b739', '#0fbcf9', '#0be881'];

  return (
    <Layout>
      <div className="project-detail">

        {/* Back button */}
        <button className="back-btn" onClick={() => navigate('/projects')}>
          <FaArrowLeft /> Back to Projects
        </button>

        {/* Project Header */}
        <div className="detail-header">
          <div className="detail-header-left">
            <div className="detail-badges">
              <span className={`status-badge status-badge--${project.status}`}>
                {project.status.replace('_', ' ')}
              </span>
              <span className={`priority-badge priority-badge--${project.priority}`}>
                {project.priority}
              </span>
            </div>
            <h1 className="detail-title">{project.name}</h1>
            <div className="detail-meta">
              <span className="detail-meta-item">
                <FaMapMarkerAlt /> {project.location}
              </span>
              <span className="detail-meta-item">
                <FaCalendarAlt /> {new Date(project.start_date).toLocaleDateString()}
                {' → '}
                {new Date(project.end_date).toLocaleDateString()}
              </span>
            </div>
            {project.description && (
              <p className="detail-description">{project.description}</p>
            )}
          </div>

          {/* Progress Circle */}
          <div className="detail-progress-circle">
            <div className="circle-wrapper">
              <svg viewBox="0 0 100 100" className="circle-svg">
                <circle cx="50" cy="50" r="40" className="circle-bg" />
                <circle
                  cx="50" cy="50" r="40"
                  className="circle-fill"
                  strokeDasharray={`${(project.completion_percentage / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="circle-text">
                <span className="circle-percentage">
                  {project.completion_percentage}%
                </span>
                <span className="circle-label">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="detail-stats">
          <div className="detail-stat-card">
            <span className="detail-stat-label">Total Budget</span>
            <span className="detail-stat-value">
              ₦{Number(project.budget).toLocaleString()}
            </span>
          </div>
          <div className="detail-stat-card">
            <span className="detail-stat-label">Amount Spent</span>
            <span className="detail-stat-value detail-stat-value--danger">
              ₦{Number(project.spent).toLocaleString()}
            </span>
          </div>
          <div className="detail-stat-card">
            <span className="detail-stat-label">Remaining</span>
            <span className="detail-stat-value detail-stat-value--success">
              ₦{Number(project.budget_remaining).toLocaleString()}
            </span>
          </div>
          <div className="detail-stat-card">
            <span className="detail-stat-label">Total Tasks</span>
            <span className="detail-stat-value">{stats?.total_tasks || 0}</span>
          </div>
          <div className="detail-stat-card">
            <span className="detail-stat-label">Milestones</span>
            <span className="detail-stat-value">
              {stats?.completed_milestones || 0}/{stats?.total_milestones || 0}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          {['overview', 'tasks', 'milestones'].map(tab => (
            <button
              key={tab}
              className={`detail-tab ${activeTab === tab ? 'detail-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="detail-overview">
            <div className="overview-grid">

              {/* Site Engineer */}
              <div className="info-card">
                <h3 className="info-card-title">
                  <FaHardHat /> Site Engineer
                </h3>
                {project.site_engineer_name ? (
                  <div className="info-card-content">
                    <div className="info-row">
                      <span className="info-label">Name</span>
                      <span className="info-value">{project.site_engineer_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label"><FaPhone /> Phone</span>
                      <span className="info-value">{project.site_engineer_phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="info-empty">No site engineer assigned</p>
                )}
              </div>

              {/* Contractor */}
              <div className="info-card">
                <h3 className="info-card-title">
                  <FaBuilding /> Contractor
                </h3>
                {project.contractor_name ? (
                  <div className="info-card-content">
                    <div className="info-row">
                      <span className="info-label">Name</span>
                      <span className="info-value">{project.contractor_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Company</span>
                      <span className="info-value">{project.contractor_company}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label"><FaPhone /> Phone</span>
                      <span className="info-value">{project.contractor_phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="info-empty">No contractor assigned</p>
                )}
              </div>

              {/* Task Chart */}
              <div className="info-card">
                <h3 className="info-card-title">Task Breakdown</h3>
                {stats?.total_tasks > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%" cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={PIE_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="info-empty">No tasks yet</p>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="detail-tasks">
            <div className="tab-header">
              <h3 className="tab-title">Tasks ({tasks.length})</h3>
              <button
                className="tab-add-btn"
                onClick={() => setShowTaskForm(!showTaskForm)}
              >
                <FaPlus /> Add Task
              </button>
            </div>

            {showTaskForm && (
              <form className="inline-form" onSubmit={handleCreateTask}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Task title *"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
                <input
                  className="form-input"
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                />
                <select
                  className="form-input"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="inline-form-actions">
                  <button type="submit" className="btn-submit">Add Task</button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowTaskForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-state">No tasks yet — add your first task</div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="task-item">
                    <button
                      className={`task-status-btn task-status-btn--${task.status}`}
                      onClick={() => handleTaskStatus(task)}
                      title="Click to change status"
                    >
                      {task.status === 'done' && <FaCheck />}
                    </button>
                    <div className="task-info">
                      <span className={`task-title ${task.status === 'done' ? 'task-title--done' : ''}`}>
                        {task.title}
                      </span>
                      {task.due_date && (
                        <span className="task-due">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <span className={`priority-badge priority-badge--${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge status-badge--${task.status}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <button
                      className="task-delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="detail-milestones">
            <div className="tab-header">
              <h3 className="tab-title">Milestones ({milestones.length})</h3>
              <button
                className="tab-add-btn"
                onClick={() => setShowMilestoneForm(!showMilestoneForm)}
              >
                <FaPlus /> Add Milestone
              </button>
            </div>

            {showMilestoneForm && (
              <form className="inline-form" onSubmit={handleCreateMilestone}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Milestone title *"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  required
                />
                <input
                  className="form-input"
                  type="date"
                  value={milestoneForm.due_date}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                  required
                />
                <div className="inline-form-actions">
                  <button type="submit" className="btn-submit">Add Milestone</button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowMilestoneForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="milestones-list">
              {milestones.length === 0 ? (
                <div className="empty-state">No milestones yet — add your first milestone</div>
              ) : (
                milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className={`milestone-item ${milestone.is_completed ? 'milestone-item--done' : ''}`}
                  >
                    <button
                      className={`milestone-check ${milestone.is_completed ? 'milestone-check--done' : ''}`}
                      onClick={() => handleMilestoneToggle(milestone)}
                    >
                      {milestone.is_completed && <FaCheck />}
                    </button>
                    <div className="milestone-info">
                      <span className={`milestone-title ${milestone.is_completed ? 'milestone-title--done' : ''}`}>
                        {milestone.title}
                      </span>
                      <span className="milestone-due">
                        Due: {new Date(milestone.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`milestone-status ${milestone.is_completed ? 'milestone-status--done' : ''}`}>
                      {milestone.is_completed ? 'Completed' : 'Pending'}
                    </span>
                    <button
                      className="task-delete-btn"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default ProjectDetail;