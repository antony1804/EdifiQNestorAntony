import { NavLink, useNavigate } from "react-router-dom";

const links = [
  {
    to: "/vigilante",
    label: "Inicio",
    icon: "🏠"
  },
  {
    to: "/vigilante/visitas",
    label: "Visitas",
    icon: "🚪"
  },
  {
    to: "/vigilante/paquetes",
    label: "Paquetes",
    icon: "📦"
  }
];


export default function VigilanteSidebar() {

  const navigate = useNavigate();


  const cerrarSesion = () => {

    localStorage.removeItem("authUser");

    navigate("/login");

  };


  return (

    <aside className="admin-sidebar">

      <div className="admin-sidebar-brand">

        <span>
          EdifiQ
        </span>

        <small>
          Control de vigilancia
        </small>

      </div>


      <nav className="admin-sidebar-nav">

        {links.map((link) => (

          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/vigilante"}
            className={({ isActive }) =>
              "admin-sidebar-link" +
              (isActive ? " active" : "")
            }
          >

            <span>
              {link.icon}
            </span>

            {" "}

            {link.label}

          </NavLink>

        ))}

      </nav>


      <button
        className="logout-btn"
        onClick={cerrarSesion}
      >
        🚪 Cerrar sesión
      </button>

    </aside>

  );
}