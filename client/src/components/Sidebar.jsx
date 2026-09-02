import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaProjectDiagram,
  FaTasks,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="side-panel">
      <nav className="side-navigation">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `side-nav-link ${isActive ? "active" : ""}`
          }
        >
          <FaThLarge className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `side-nav-link ${isActive ? "active" : ""}`
          }
        >
          <FaProjectDiagram className="nav-icon" />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `side-nav-link ${isActive ? "active" : ""}`
          }
        >
          <FaTasks className="nav-icon" />
          <span>Tasks</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;