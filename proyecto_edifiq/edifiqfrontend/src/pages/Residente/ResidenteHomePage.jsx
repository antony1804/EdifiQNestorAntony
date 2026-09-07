import { Link } from "react-router-dom";
import "../../styles/modules.css";

const cards = [
    ["Mis paquetes", "/residente/paquetes"],
    ["Mis visitas", "/residente/visitas"],
    ["Mis reservas", "/residente/reservas"],
    ["Mis recibos", "/residente/recibos"],
    ["Mi apartamento", "/residente/apartamento"],
];

export default function ResidenteHomePage() {
    const user = JSON.parse(localStorage.getItem("authUser") || "null");

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h1 className="module-title">
                        Hola, {user?.persona?.nombres || "residente"} bienvenido
                    </h1>
                    <p className="module-subtitle">
                        Consulta la información de tu residencia.
                    </p>
                </div>
            </div>

            <div className="admin-home-grid">
                {cards.map(([name, to]) => (
                    <Link key={to} to={to} className="admin-card">
                        <span className="admin-card-label">{name}</span>
                        <span className="admin-card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}