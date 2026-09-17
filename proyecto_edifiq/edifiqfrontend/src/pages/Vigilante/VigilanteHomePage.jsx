import { Link } from "react-router-dom";
import "../../styles/modules.css";

export default function VigilanteHomePage() {

  const usuario = JSON.parse(
    localStorage.getItem("authUser") || "null"
  );

  const nombre = usuario?.persona?.nombres || "Vigilante";

  const tarjetas = [
    ["01", "Control de visitas", "Registra entradas y salidas de visitantes.", "/vigilante/visitas"],
    ["02", "Gestión de paquetes", "Registra y controla los paquetes recibidos.", "/vigilante/paquetes"],
    ["03", "Recibos", "Consulta y registra recibos del conjunto.", "/vigilante/recibos"],
    ["04", "Mi perfil", "Revisa y actualiza tus datos personales.", "/vigilante/perfil"]
  ];

  return (
    <div className="module-page">

      <div className="admin-overview-head">
        <div>
          <span className="admin-overview-kicker">CENTRO DE CONTROL / EDIFIQ</span>
          <h1>Hola, {nombre}</h1>
          <p>Supervisa los movimientos diarios del conjunto desde un único punto de control.</p>
        </div>
        <div className="admin-overview-stamp">
          <strong>VIG</strong>
          <span>CONTROL<br />DE ACCESO</span>
        </div>
      </div>

      <div className="admin-module-heading">
        <div>
          <span className="admin-overview-kicker">OPERACIÓN DIARIA</span>
          <h2>Accesos rápidos</h2>
        </div>
        <span className="admin-module-count">4 módulos activos</span>
      </div>

      <div className="admin-module-list vigilante-module-list">
        {tarjetas.map(([number, title, description, route]) => (
          <Link key={route} to={route} className="admin-module-row">
            <span className="admin-module-number">{number}</span>
            <span className="admin-module-copy">
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <span className="admin-module-arrow">↗</span>
          </Link>
        ))}
      </div>

    </div>
  );
}