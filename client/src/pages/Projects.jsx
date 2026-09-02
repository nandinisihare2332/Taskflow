import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planning",
  });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search) {
        params.search = search;
      }

      if (status) {
        params.status = status;
      }

      const response = await API.get("/projects", {
        params,
      });

      setProjects(response.data.projects);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, status]);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open create form
  const openCreateForm = () => {
    setEditingProject(null);

    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Planning",
    });

    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name,
      description: project.description || "",
      startDate: project.startDate
        ? project.startDate.split("T")[0]
        : "",
      endDate: project.endDate
        ? project.endDate.split("T")[0]
        : "",
      status: project.status,
    });

    setShowForm(true);
  };

  // Submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError(
        "Project name, start date and end date are required"
      );
      return;
    }

    if (
      new Date(formData.startDate) >
      new Date(formData.endDate)
    ) {
      setError("End date cannot be before start date");
      return;
    }

    try {
      if (editingProject) {
        await API.put(
          `/projects/${editingProject._id}`,
          formData
        );
      } else {
        await API.post("/projects", formData);
      }

      setShowForm(false);
      setEditingProject(null);

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save project"
      );
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? Its tasks will also be deleted."
    );

    if (!confirmed) return;

    try {
      await API.delete(`/projects/${id}`);

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete project"
      );
    }
  };

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your projects</p>
        </div>

        <button
          className="primary-button create-button"
          onClick={openCreateForm}
        >
          + New Project
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-card">
          <h2>
            {editingProject
              ? "Edit Project"
              : "Create Project"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows="4"
              />
            </div>

            <div className="date-grid">
              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
              >
                {editingProject
                  ? "Update Project"
                  : "Create Project"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects */}
      {loading ? (
        <div className="page-center">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects found</h2>
          <p>Create your first project to get started.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              className="project-card"
              key={project._id}
            >
              <div className="project-card-header">
                <h2>{project.name}</h2>

                <span
                  className={`status-badge ${project.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {project.status}
                </span>
              </div>

              <p className="project-description">
                {project.description ||
                  "No description provided"}
              </p>

              <div className="project-dates">
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(
                    project.startDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>End:</strong>{" "}
                  {new Date(
                    project.endDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="project-actions">
                <Link
                  to={`/projects/${project._id}`}
                  className="secondary-button"
                >
                  View
                </Link>

                <button
                  className="secondary-button"
                  onClick={() =>
                    openEditForm(project)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(project._id)
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

export default Projects;