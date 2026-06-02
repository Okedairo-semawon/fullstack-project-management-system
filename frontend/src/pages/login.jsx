import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHardHat, FaUser, FaLock } from "react-icons/fa";

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
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Left side */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div style={{ color: "white", maxWidth: "400px" }}>
          <FaHardHat
            style={{ fontSize: "64px", color: "#e94560", marginBottom: "24px" }}
          />
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              marginBottom: "16px",
              lineHeight: "1.2",
            }}
          >
            Hitech Construction
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "1.6",
              marginBottom: "40px",
            }}
          >
            Managing big projects, delivering excellence across every site in
            Nigeria.
          </p>
          <div style={{ display: "flex", gap: "40px" }}>
            {[
              ["50+", "Projects"],
              ["200+", "Workers"],
              ["12+", "Years"],
            ].map(([num, label]) => (
              <div
                key={label}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#e94560",
                  }}
                >
                  {num}
                </span>
                <span
                  style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          width: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f2f5",
          padding: "40px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            width: "100%",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1a1a2e",
              marginBottom: "8px",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{ fontSize: "14px", color: "#6c757d", marginBottom: "32px" }}
          >
            Sign in to your account
          </p>

          {error && (
            <div
              style={{
                background: "#fff5f5",
                border: "1px solid #fed7d7",
                color: "#e53e3e",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1a1a2e",
                  marginBottom: "8px",
                }}
              >
                Username
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaUser
                  style={{
                    position: "absolute",
                    left: "14px",
                    color: "#6c757d",
                    fontSize: "14px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#1a1a2e",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1a1a2e",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaLock
                  style={{
                    position: "absolute",
                    left: "14px",
                    color: "#6c757d",
                    fontSize: "14px",
                  }}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#1a1a2e",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading
                  ? "#ccc"
                  : "linear-gradient(135deg, #e94560, #ff6b6b)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                boxSizing: "border-box",
              }}
            >
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
