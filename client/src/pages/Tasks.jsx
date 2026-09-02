import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;

      const response = await API.get("/tasks", {
        params,
      });

      setTasks(response.data.tasks);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, priority]);

  const updateStatus = async (task, newStatus) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>View and manage all your tasks</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {loading ? (
        <div className="page-center">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks found</h2>
          <p>
            Create tasks from a project's details page.
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div
              className="task-card"
              key={task._id}
            >
              <div className="task-header">
                <h3>{task.title}</h3>

                <span className="status-badge">
                  {task.status}
                </span>
              </div>

              <p className="task-description">
                {task.description ||
                  "No description provided"}
              </p>

              <div className="task-meta">
                <span>
                  Project:{" "}
                  <strong>
                    {task.project?.name ||
                      "Unknown"}
                  </strong>
                </span>

                <span>
                  Priority:{" "}
                  <strong>
                    {task.priority}
                  </strong>
                </span>

                <span>
                  Due:{" "}
                  {new Date(
                    task.dueDate
                  ).toLocaleDateString()}
                </span>
              </div>

              <select
                value={task.status}
                onChange={(e) =>
                  updateStatus(
                    task,
                    e.target.value
                  )
                }
              >
                <option value="Todo">Todo</option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <div className="project-actions">
                <Link
                  to={`/projects/${task.project?._id}`}
                  className="secondary-button"
                >
                  View Project
                </Link>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteTask(task._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;