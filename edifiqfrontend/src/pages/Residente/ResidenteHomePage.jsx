import { Link } from "react-router-dom";

function ResidenteHomePage() {
  return (
    <div className="residente-home">
      <h1 className="residente-home-title">Panel de Residente</h1>
      <p className="residente-home-subtitle">
        Selecciona una sección para consultar
      </p>

      <div className="residente-home-grid">
        <Link to="/residente/paquetes" className="residente-card">
          <span className="residente-card-label">Mis paquetes</span>
        </Link>

        <Link to="/residente/visitas" className="residente-card">
          <span className="residente-card-label">Mis visitas</span>
        </Link>

        <Link to="/residente/reservas" className="residente-card">
          <span className="residente-card-label">Reservas</span>
        </Link>

        <Link to="/residente/recibos" className="residente-card">
          <span className="residente-card-label">Mis recibos</span>
        </Link>

        <Link to="/residente/apartamento" className="residente-card">
          <span className="residente-card-label">Mi apartamento</span>
        </Link>
      </div>
    </div>
  );
}

export default ResidenteHomePage;

