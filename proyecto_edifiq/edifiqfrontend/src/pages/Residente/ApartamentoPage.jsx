import { useEffect, useState } from "react";
import {getApartamentoDePersona} from "../../api";
import "../../styles/modules.css";
export default function ApartamentoPage() {
	const [data, setData] = useState(null);
	const [error, setError] = useState("");
	const user = JSON.parse(localStorage.getItem("authUser") || "null");

	useEffect(() => {
		getApartamentoDePersona(user?.persona?.id)
			.then(setData)
			.catch((e) => setError(e.message));
	}, []);

	if (error) {
		return (
			<div className="module-page">
				<div className="card-panel">
					<div className="form-error">{error}</div>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="module-page">
				<div className="card-panel">Cargando apartamento...</div>
			</div>
		);
	}

	const a = data.apartamento;
	const p = data.persona;

	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Mi apartamento</h1>
					<p className="module-subtitle">
						Información de tu unidad residencial.
					</p>
				</div>
			</div>

			<div className="card-panel">
				<div className="form-grid">
					<div>
						<strong>Torre</strong>
						<p>{a.torre?.nombreTorre}</p>
					</div>
					<div>
						<strong>Apartamento</strong>
						<p>{a.numeroApartamento}</p>
					</div>
					<div>
						<strong>Piso</strong>
						<p>{a.piso}</p>
					</div>
					<div>
						<strong>Estado</strong>
						<p>{a.activo ? "Activo" : "Inactivo"}</p>
					</div>
					<div>
						<strong>Residente</strong>
						<p>
							{p?.nombres} {p?.apellidos}
						</p>
					</div>
					<div>
						<strong>Tipo</strong>
						<p>{data.tipoResidente?.nombre}</p>
					</div>
					<div>
						<strong>Ingreso</strong>
						<p>{data.fechaIngreso}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
