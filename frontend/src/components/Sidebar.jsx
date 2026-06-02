import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHardHat,
  FaTachometerAlt,
  FaProjectDiagram,
  FaPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (user.first_name) return user.first_name[0].toUpperCase();
    return user.username[0].toUpperCase();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-logo">
          <FaHardHat className="mobile-topbar-icon" />
          <span>Hitech Construction</span>
        </div>
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <FaHardHat className="sidebar-logo-icon" />
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">Hitech</span>
            <span className="sidebar-logo-subtitle">Construction Ltd</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={closeMenu}
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main</div>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
            onClick={closeMenu}
          >
            <FaTachometerAlt className="sidebar-link-icon" />
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
            onClick={closeMenu}
          >
            <FaProjectDiagram className="sidebar-link-icon" />
            Projects
          </NavLink>

          <div className="sidebar-section-title">Actions</div>

          <NavLink
            to="/projects/create"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
            onClick={closeMenu}
          >
            <FaPlus className="sidebar-link-icon" />
            New Project
          </NavLink>
        </nav>

        {/* Bottom user section */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials()}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">
                {user?.first_name || user?.username}
              </span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>

      </div>
    </>
  );
}

export default Sidebar;