import { useEffect, useState } from "react";
import {
	asignacionesApi,
	apartamentosApi,
	getPersonas,
	getTiposResidente,
} from "../../api";
import "../../styles/modules.css";
const initial = {
	apartamentoId: "",
	personaId: "",
	tipoResidenteId: "",
	fechaIngreso: new Date().toISOString().slice(0, 10),
	fechaSalida: "",
};

export default function AsignacionesPage() {
	const [items, setItems] = useState([]);
	const [apts, setApts] = useState([]);
	const [personas, setPersonas] = useState([]);
	const [tipos, setTipos] = useState([]);
	const [form, setForm] = useState(initial);
	const [error, setError] = useState("");

	const load = () =>
		asignacionesApi.list().then(setItems).catch((e) => setError(e.message));

	useEffect(() => {
		load();
		apartamentosApi.list().then(setApts);
		getPersonas().then(setPersonas);
		getTiposResidente().then(setTipos);
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			await asignacionesApi.create({
				apartamento: { id: Number(form.apartamentoId) },
				persona: { id: Number(form.personaId) },
				tipoResidente: { id: Number(form.tipoResidenteId) },
				fechaIngreso: form.fechaIngreso,
				fechaSalida: form.fechaSalida || null,
			});
			setForm(initial);
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	const remove = async (x) => {
		if (confirm("¿Quitar esta asignación?")) {
			try {
				await asignacionesApi.remove(
					`${x.apartamento?.id}/${x.persona?.id}`,
				);
				load();
			} catch (e) {
				setError(e.message);
			}
		}
	};

	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Asignación de residentes</h1>
					<p className="module-subtitle">
						Relaciona personas con su apartamento y tipo de residencia.
					</p>
				</div>
			</div>

			<div className="card-panel">
				<form onSubmit={submit}>
					<div className="form-grid">
						<div className="form-group">
							<label>Apartamento</label>
							<select
								required
								value={form.apartamentoId}
								onChange={(e) =>
									setForm({ ...form, apartamentoId: e.target.value })
								}
							>
								<option value="">Seleccione...</option>
								{apts.map((a) => (
									<option key={a.id} value={a.id}>
										{a.torre?.nombreTorre} - {a.numeroApartamento}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label>Persona</label>
							<select
								required
								value={form.personaId}
								onChange={(e) => setForm({ ...form, personaId: e.target.value })}
							>
								<option value="">Seleccione...</option>
								{personas.map((p) => (
									<option key={p.id} value={p.id}>
										{p.nombres} {p.apellidos} · {p.numeroDocumento}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label>Tipo de residente</label>
							<select
								required
								value={form.tipoResidenteId}
								onChange={(e) =>
									setForm({ ...form, tipoResidenteId: e.target.value })
								}
							>
								<option value="">Seleccione...</option>
								{tipos.map((t) => (
									<option key={t.id} value={t.id}>
										{t.nombre}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label>Fecha de ingreso</label>
							<input
								required
								type="date"
								value={form.fechaIngreso}
								onChange={(e) =>
									setForm({ ...form, fechaIngreso: e.target.value })
								}
							/>
						</div>

						<div className="form-group">
							<label>Fecha de salida (opcional)</label>
							<input
								type="date"
								min={form.fechaIngreso}
								value={form.fechaSalida}
								onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })}
							/>
						</div>
					</div>

					{error && <div className="form-error">{error}</div>}

					<div className="form-footer">
						<button className="primary-btn">Asignar residente</button>
					</div>
				</form>
			</div>

			<div className="card-panel" style={{ marginTop: 20 }}>
				<div className="table-wrap">
					<table className="module-table">
						<thead>
							<tr>
								<th>Apartamento</th>
								<th>Persona</th>
								<th>Tipo</th>
								<th>Ingreso</th>
								<th>Salida</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							{items.length ? (
								items.map((x, i) => (
									<tr key={`${x.apartamento?.id}-${x.persona?.id}-${i}`}>
										<td>
											{x.apartamento?.torre?.nombreTorre} - {x.apartamento?.numeroApartamento}
										</td>
										<td>
											{x.persona?.nombres} {x.persona?.apellidos}
										</td>
										<td>{x.tipoResidente?.nombre}</td>
										<td>{x.fechaIngreso}</td>
										<td>{x.fechaSalida || "Activo"}</td>
										<td>
											<button
												className="danger-btn small-btn"
												onClick={() => remove(x)}
											>
												Quitar
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="empty-row">
										No hay asignaciones.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
