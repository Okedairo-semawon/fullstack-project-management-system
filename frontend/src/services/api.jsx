import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  withCredentials: false,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Projects
export const getProjects = (filters = {}) => API.get('/projects/', { params: filters });
export const getProject = (id) => API.get(`/projects/${id}/`);
export const createProject = (data) => API.post('/projects/', data);
export const updateProject = (id, data) => API.put(`/projects/${id}/`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}/`);
export const getProjectStats = (id) => API.get(`/projects/${id}/stats/`);

// Tasks
export const getTasks = (filters = {}) => API.get('/tasks/', { params: filters });
export const createTask = (data) => API.post('/tasks/', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}/`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}/`);

// Milestones
export const getMilestones = (filters = {}) => API.get('/milestones/', { params: filters });
export const createMilestone = (data) => API.post('/milestones/', data);
export const updateMilestone = (id, data) => API.put(`/milestones/${id}/`, data);
export const deleteMilestone = (id) => API.delete(`/milestones/${id}/`);

// Documents
export const getDocuments = (filters = {}) => API.get('/documents/', { params: filters });
export const uploadDocument = (data) => API.post('/documents/', data);
export const deleteDocument = (id) => API.delete(`/documents/${id}/`);

// Users
export const getUsers = () => API.get('/users/');

// Auth
export const loginUser = (credentials) =>
  axios.post('http://localhost:8000/api/auth/login/', credentials);

export default API;