import { Link } from "react-router-dom";
import "../../styles/modules.css";

const cards = [
	["", "Personas", "/admin/personas"],
	["", "Apartamentos", "/admin/apartamentos"],
	["", "Paquetes", "/admin/paquetes"],
	["", "Recibos", "/admin/recibos"],
	["", "Reservas", "/admin/reservas"],
	["", "Visitas", "/admin/visitas"],
	["", "Zonas comunes", "/admin/zonas"],
	["", "Torres", "/admin/torres"],
];

export default function AdminHomePage() {
	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Panel de administrador</h1>
					<p className="module-subtitle">
						Gestiona la operación de EdifiQ desde un solo lugar.
					</p>
				</div>
			</div>

			<div className="admin-home-grid">
				{cards.map(([icon, name, to]) => (
					<Link key={to} to={to} className="admin-card">
						<span className="admin-card-icon">{icon}</span>
						<span className="admin-card-label">{name}</span>
						<span className="admin-card-arrow">→</span>
					</Link>
				))}
			</div>
		</div>
	);
}
