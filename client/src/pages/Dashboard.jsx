import { useEffect, useState } from "react";
import {
  FaProjectDiagram,
  FaTasks,
  FaClipboardList,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await API.get("/dashboard");

        setStats(response.data);

        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>
          Welcome back, {user?.name || "User"}!
        </p>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* STAT CARDS */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon">
            <FaProjectDiagram />
          </div>

          <div className="card-content">
            <h3>Total Projects</h3>
            <strong>{stats.totalProjects}</strong>
          </div>
        </div>


        <div className="dashboard-card">
          <div className="card-icon">
            <FaTasks />
          </div>

          <div className="card-content">
            <h3>Total Tasks</h3>
            <strong>{stats.totalTasks}</strong>
          </div>
        </div>


        <div className="dashboard-card">
          <div className="card-icon">
            <FaClipboardList />
          </div>

          <div className="card-content">
            <h3>Todo</h3>
            <strong>{stats.todoTasks}</strong>
          </div>
        </div>


        <div className="dashboard-card">
          <div className="card-icon">
            <FaSpinner />
          </div>

          <div className="card-content">
            <h3>In Progress</h3>
            <strong>{stats.inProgressTasks}</strong>
          </div>
        </div>


        <div className="dashboard-card">
          <div className="card-icon">
            <FaCheckCircle />
          </div>

          <div className="card-content">
            <h3>Completed</h3>
            <strong>{stats.completedTasks}</strong>
          </div>
        </div>

      </div>

      {/* TASK SUMMARY */}
      <div className="dashboard-summary">

        <div className="summary-header">
          <h2>Task Overview</h2>
          <span>Current status</span>
        </div>

        <div className="summary-list">

          <div className="summary-item">
            <div>
              <span className="summary-label">Todo</span>
            </div>

            <strong>{stats.todoTasks}</strong>
          </div>

          <div className="summary-item">
            <div>
              <span className="summary-label">
                In Progress
              </span>
            </div>

            <strong>{stats.inProgressTasks}</strong>
          </div>

          <div className="summary-item">
            <div>
              <span className="summary-label">
                Completed
              </span>
            </div>

            <strong>{stats.completedTasks}</strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;