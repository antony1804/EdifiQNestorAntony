import { Link } from "react-router-dom";
import "../../styles/modules.css";

export default function VigilanteHomePage() {

  const usuario = JSON.parse(
    localStorage.getItem("authUser") || "null"
  );

  const nombre = usuario?.persona?.nombres || "Vigilante";

  const tarjetas = [
    {
      icono: "🚪",
      titulo: "Control de visitas",
      descripcion: "Registra entradas y salidas de visitantes.",
      ruta: "/vigilante/visitas"
    },
    {
      icono: "📦",
      titulo: "Gestión de paquetes",
      descripcion: "Registra y controla los paquetes recibidos.",
      ruta: "/vigilante/paquetes"
    }
  ];

  return (
    <div className="module-page">

      <div className="module-header">

        <div>
          <h1 className="module-title">
            Hola, {nombre} 👮
          </h1>

          <p className="module-subtitle">
            Bienvenido al panel de control de vigilancia de EdifiQ.
          </p>
        </div>

        <div>
          <span className="badge badge-info">
            👮 Vigilante
          </span>
        </div>

      </div>


      <div className="card-panel">

        <h2 className="section-title">
          Acciones rápidas
        </h2>

        <p className="section-subtitle">
          Gestiona las actividades principales del conjunto residencial.
        </p>


        <div className="admin-home-grid">

          {tarjetas.map((tarjeta) => (

            <Link
              key={tarjeta.ruta}
              to={tarjeta.ruta}
              className="admin-card"
            >

              <span className="admin-card-icon">
                {tarjeta.icono}
              </span>

              <span className="admin-card-label">
                {tarjeta.titulo}
              </span>

              <p className="vigilante-card-description">
                {tarjeta.descripcion}
              </p>

              <span className="admin-card-arrow">
                →
              </span>

            </Link>

          ))}

        </div>

      </div>


      <div className="vigilante-info-grid">

        <div className="vigilante-info-card">

          <div className="vigilante-info-icon">
            🚪
          </div>

          <div>
            <h3>Visitas</h3>

            <p>
              Registra y controla el ingreso y salida de visitantes.
            </p>
          </div>

        </div>


        <div className="vigilante-info-card">

          <div className="vigilante-info-icon">
            📦
          </div>

          <div>
            <h3>Paquetes</h3>

            <p>
              Controla los paquetes recibidos para los residentes.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}