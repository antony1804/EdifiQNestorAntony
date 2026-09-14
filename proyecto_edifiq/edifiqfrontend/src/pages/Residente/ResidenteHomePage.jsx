import { Link } from "react-router-dom";
import "../../styles/modules.css";

const cards = [
    ["01", "Mis paquetes", "Consulta tus entregas pendientes.", "/residente/paquetes"],
    ["02", "Mis visitas", "Revisa quién ha ingresado.", "/residente/visitas"],
    ["03", "Mis reservas", "Organiza tus espacios comunes.", "/residente/reservas"],
    ["04", "Mis recibos", "Consulta cobros y pagos.", "/residente/recibos"],
    ["05", "Mi apartamento", "Consulta tu información residencial.", "/residente/apartamento"],
];

export default function ResidenteHomePage() {
    const user = JSON.parse(localStorage.getItem("authUser") || "null");

    return (
        <div className="module-page">
            <div className="admin-overview-head">
                <div>
                    <span className="admin-overview-kicker">MI ESPACIO / EDIFIQ</span>
                    <h1>Hola, {user?.persona?.nombres || "residente"}</h1>
                    <p>Todo lo que necesitas para consultar y organizar tu vida en el conjunto.</p>
                </div>
                <div className="admin-overview-stamp">
                    <strong>RES</strong>
                    <span>ESPACIO<br />RESIDENCIAL</span>
                </div>
            </div>

            <div className="admin-module-heading">
                <div>
                    <span className="admin-overview-kicker">MI INFORMACIÓN</span>
                    <h2>Accesos personales</h2>
                </div>
                <span className="admin-module-count">{cards.length} espacios disponibles</span>
            </div>

            <div className="admin-module-list resident-module-list">
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