import { Link } from "react-router-dom";
import "../../styles/modules.css";

const cards = [
	["01", "Personas", "Directorio y datos de contacto", "/admin/personas"],
	["02", "Apartamentos", "Unidades y estado de ocupación", "/admin/apartamentos"],
	["03", "Paquetes", "Recepción y entregas", "/admin/paquetes"],
	["04", "Recibos", "Cobros y vencimientos", "/admin/recibos"],
	["05", "Reservas", "Agenda de zonas comunes", "/admin/reservas"],
	["06", "Visitas", "Control de accesos", "/admin/visitas"],
	["07", "Zonas comunes", "Espacios disponibles", "/admin/zonas"],
	["08", "Torres", "Estructura del conjunto", "/admin/torres"],
];

export default function AdminHomePage() {
	return (
		<div className="module-page">
			<div className="admin-overview-head">
				<div>
					<span className="admin-overview-kicker">CENTRO DE OPERACIONES / EDIFIQ</span>
					<h1>Panel de administrador</h1>
					<p>Una vista general para moverte entre las áreas que mantienen funcionando el conjunto.</p>
				</div>
				<div className="admin-overview-stamp">
					<strong>EDQ</strong>
					<span>CONTROL<br />RESIDENCIAL</span>
				</div>
			</div>

			<div className="admin-module-heading">
				<div>
					<span className="admin-overview-kicker">MÓDULOS</span>
					<h2>Áreas de gestión</h2>
				</div>
				<span className="admin-module-count">{cards.length} accesos disponibles</span>
			</div>

			<div className="admin-module-list">
				{cards.map(([number, name, description, to]) => (
					<Link key={to} to={to} className="admin-module-row">
						<span className="admin-module-number">{number}</span>
						<span className="admin-module-copy">
							<strong>{name}</strong>
							<small>{description}</small>
						</span>
						<span className="admin-module-arrow">↗</span>
					</Link>
				))}
			</div>
		</div>
	);
}
