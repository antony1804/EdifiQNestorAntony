import { Link } from "react-router-dom";
import "../App.css";
function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>EdifiQ</h1>
        <p>Sistema de gestión para conjuntos residenciales</p>
      </header>

      <section className="landing-content">
        <h2>¿Qué es EdifiQ?</h2>
        <p>
          EdifiQ es una plataforma para administrar torres, apartamentos, residentes,
          visitas, paquetería, recibos de servicios y zonas comunes de un conjunto
          residencial, todo desde un solo panel.
        </p>

        <h2>Funcionalidades</h2>
        <ul>
          <li>Registro y control de residentes</li>
          <li>Gestión de visitas y correspondencia</li>
          <li>Reservas de zonas comunes</li>
          <li>Control de recibos y pagos</li>
        </ul>

        <Link to="/login" className="landing-cta">
          Iniciar sesión
        </Link>
      </section>
    </div>
  );
}

export default LandingPage;