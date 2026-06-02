import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHardHat, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left side */}
      <div className="register-left">
        <div className="register-left-content">
          <FaHardHat className="register-logo" />
          <h1 className="register-brand-title">Hitech Construction</h1>
          <p className="register-brand-subtitle">
            Join our platform to manage construction projects efficiently across Nigeria.
          </p>
          <div className="register-stats">
            {[['50+', 'Projects'], ['200+', 'Workers'], ['12+', 'Years']].map(([num, label]) => (
              <div key={label} className="register-stat-item">
                <span className="register-stat-number">{num}</span>
                <span className="register-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="register-right">
        <div className="register-card">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Fill in your details to get started</p>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="register-row">
              <div className="register-input-group">
                <label className="register-label">First Name</label>
                <input
                  className="register-input"
                  type="text"
                  name="first_name"
                  placeholder="John"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="register-input-group">
                <label className="register-label">Last Name</label>
                <input
                  className="register-input"
                  type="text"
                  name="last_name"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label className="register-label">Username</label>
              <div className="register-input-wrapper">
                <FaUser className="register-input-icon" />
                <input
                  className="register-input register-input--icon"
                  type="text"
                  name="username"
                  placeholder="Enter a username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label className="register-label">Email</label>
              <div className="register-input-wrapper">
                <FaEnvelope className="register-input-icon" />
                <input
                  className="register-input register-input--icon"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label className="register-label">Password</label>
              <div className="register-input-wrapper">
                <FaLock className="register-input-icon" />
                <input
                  className="register-input register-input--icon"
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label className="register-label">Confirm Password</label>
              <div className="register-input-wrapper">
                <FaLock className="register-input-icon" />
                <input
                  className="register-input register-input--icon"
                  type="password"
                  name="confirm_password"
                  placeholder="Repeat your password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="register-login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;