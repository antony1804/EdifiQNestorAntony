import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">EdifiQ Admin</div>
      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => "admin-sidebar-link" + (isActive ? " active" : "")}
        >
           Inicio
        </NavLink>
        <NavLink
          to="/admin/personas"
          className={({ isActive }) => "admin-sidebar-link" + (isActive ? " active" : "")}
        >
          Personas
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;