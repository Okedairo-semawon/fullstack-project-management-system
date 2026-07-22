import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHardHat, FaUser, FaLock } from "react-icons/fa";
import "./login.css";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side */}
      <div className="login-left">
        <div
          className="login-left-content"
          style={{ color: "white", maxWidth: "400px" }}
        >
          <FaHardHat className="login-logo" />
          <h1 className="login-brand-title">Hitech Construction</h1>
          <p className="login-brand-subtitle">
            Managing big projects, delivering excellence across every site in
            Nigeria.
          </p>
          <div className="login-stats">
            {[
              ["50+", "Projects"],
              ["200+", "Workers"],
              ["12+", "Years"],
            ].map(([num, label]) => (
              <div key={label} className="login-stat-item">
                <span className="login-stat-number">{num}</span>
                <span className="login-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to your account</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="login-input-group">
              <label className="login-label">Username</label>
              <div className="login-input-wrapper">
                <FaUser className="login-input-icon" />
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-input-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <FaLock className="login-input-icon" />
                <input
                  className="login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="login-register-link">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
