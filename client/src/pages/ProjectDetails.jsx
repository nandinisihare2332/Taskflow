import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    dueDate: "",
  });

  // Fetch project
  const fetchProject = async () => {
    try {
      const response = await API.get(`/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load project"
      );
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const params = {
        project: id,
      };

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
    fetchProject();
  }, [id]);

  useEffect(() => {
    fetchTasks();
  }, [id, search, status, priority]);

  // Handle form changes
  const handleChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  // Open create form
  const openCreateForm = () => {
    setEditingTask(null);

    setTaskForm({
      title: "",
      description: "",
      priority: "Medium",
      status: "Todo",
      dueDate: "",
    });

    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (task) => {
    setEditingTask(task);

    setTaskForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
        ? task.dueDate.split("T")[0]
        : "",
    });

    setShowForm(true);
  };

  // Create / Update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !taskForm.title ||
      !taskForm.dueDate
    ) {
      setError(
        "Task title and due date are required"
      );
      return;
    }

    try {
      if (editingTask) {
        await API.put(
          `/tasks/${editingTask._id}`,
          taskForm
        );
      } else {
        await API.post("/tasks", {
          ...taskForm,
          project: id,
        });
      }

      setShowForm(false);
      setEditingTask(null);

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save task"
      );
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/tasks/${taskId}`);

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  // Quick status update
  const updateStatus = async (task, newStatus) => {
    try {
      await API.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  if (!project && !error) {
    return (
      <div className="page-center">
        Loading project...
      </div>
    );
  }

  return (
    <div className="project-details-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <Link
            to="/projects"
            className="back-link"
          >
            ← Back to Projects
          </Link>

          <h1>{project?.name}</h1>

          <p>
            {project?.description ||
              "No description provided"}
          </p>
        </div>

        <button
          className="primary-button create-button"
          onClick={openCreateForm}
        >
          + New Task
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Project information */}
      {project && (
        <div className="project-info-card">

          <div>
            <strong>Status</strong>
            <span className="status-badge">
              {project.status}
            </span>
          </div>

          <div>
            <strong>Start Date</strong>
            <span>
              {new Date(
                project.startDate
              ).toLocaleDateString()}
            </span>
          </div>

          <div>
            <strong>End Date</strong>
            <span>
              {new Date(
                project.endDate
              ).toLocaleDateString()}
            </span>
          </div>

        </div>
      )}

      {/* Task form */}
      {showForm && (
        <div className="form-card">

          <h2>
            {editingTask
              ? "Edit Task"
              : "Create Task"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Task Title</label>

              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={taskForm.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter task description"
                rows="4"
                value={taskForm.description}
                onChange={handleChange}
              />
            </div>

            <div className="date-grid">

              <div className="form-group">
                <label>Priority</label>

                <select
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleChange}
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={taskForm.status}
                  onChange={handleChange}
                >
                  <option value="Todo">
                    Todo
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>

            </div>

            <div className="form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                {editingTask
                  ? "Update Task"
                  : "Create Task"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Task filters */}
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
          <option value="">
            All Statuses
          </option>

          <option value="Todo">
            Todo
          </option>

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
          <option value="">
            All Priorities
          </option>

          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>
        </select>

      </div>

      {/* Tasks */}
      {loading ? (
        <div className="page-center">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks found</h2>

          <p>
            Create a task to get started.
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

              {/* Status */}
              <select
                value={task.status}
                onChange={(e) =>
                  updateStatus(
                    task,
                    e.target.value
                  )
                }
              >
                <option value="Todo">
                  Todo
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <div className="project-actions">

                <button
                  className="secondary-button"
                  onClick={() =>
                    openEditForm(task)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(task._id)
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

export default ProjectDetails;