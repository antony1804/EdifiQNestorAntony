import { NavLink, useNavigate } from "react-router-dom";

const links = [
	["/admin", "Inicio"],
	["/admin/personas", "Personas"],
	["/admin/torres", "Torres"],
	["/admin/apartamentos", "Apartamentos"],
	["/admin/asignaciones", "Residentes / apartamentos"],
	["/admin/paquetes", "Paquetes"],
	["/admin/recibos", "Recibos"],
	["/admin/reservas", "Reservas"],
	["/admin/visitas", "Visitas"],
	["/admin/zonas", "Zonas comunes"],
	["/admin/registro", "Crear usuario"],
];

export default function Sidebar() {
	const navigate = useNavigate();

	const logout = () => {
		localStorage.removeItem("authUser");
		navigate("/login");
	};

	return (
		<aside className="admin-sidebar">
			<div className="admin-sidebar-brand">
				<span>EdifiQ</span>
				<small>Administración residencial</small>
			</div>

			<nav className="admin-sidebar-nav">
				{links.map(([to, label]) => (
					<NavLink
						key={to}
						to={to}
						end={to === "/admin"}
						className={({ isActive }) =>
							"admin-sidebar-link" + (isActive ? " active" : "")
						}
					>
						{label}
					</NavLink>
				))}
			</nav>

			<button className="logout-btn" onClick={logout}>
				Cerrar sesión
			</button>
		</aside>
	);
}
