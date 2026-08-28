import { Link } from "react-router-dom";

function AdminHomePage() {
  return (
    <div className="admin-home">
      <h1 className="admin-home-title">Panel de Administrador</h1>
      <p className="admin-home-subtitle">Selecciona una sección para gestionar</p>

      <div className="admin-home-grid">
        <Link to="/personas" className="admin-card">
          <span className="admin-card-label">Personas</span>
        </Link>
        {/* Cuando agregues más secciones, van aquí como nuevos <Link> */}
      </div>
    </div>
  );
}

export default AdminHomePage;