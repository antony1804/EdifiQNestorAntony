import { useEffect, useState } from "react";
import Modal from "../../componentes/Modal";
import {
	visitasApi,
	apartamentosApi,
	getTiposVisita,
	getTiposDocumento,
	getEstadosVisita,
	finalizarVisita,
} from "../../api";
import "../../styles/modules.css";

const initial = {
	tipoVisitaId: "",
	tipoDocumentoId: "",
	nombreVisitante: "",
	documentoVisitante: "",
	motivoVisita: "",
	fechaIngreso: "",
	fechaSalida: "",
	estadoId: "1",
	apartamentoId: "",
};

const fmt = (d) => (d ? new Date(d).toLocaleString("es-CO") : "—");

export default function VisitasPage() {
	const [items, setItems] = useState([]);
	const [apts, setApts] = useState([]);
	const [tipos, setTipos] = useState([]);
	const [docs, setDocs] = useState([]);
	const [estados, setEstados] = useState([]);
	const [form, setForm] = useState(initial);
	const [editId, setEditId] = useState(null);
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");

	const load = () =>
		visitasApi.list().then(setItems).catch((e) => setError(e.message));

	useEffect(() => {
		load();
		apartamentosApi.list().then(setApts);
		getTiposVisita().then(setTipos);
		getTiposDocumento().then(setDocs);
		getEstadosVisita().then(setEstados);
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const v = {
				tipoVisita: { id: Number(form.tipoVisitaId) },
				tipoDocumento: { id: Number(form.tipoDocumentoId) },
				nombreVisitante: form.nombreVisitante.trim(),
				documentoVisitante: form.documentoVisitante.trim(),
				motivoVisita: form.motivoVisita.trim(),
				fechaIngreso: form.fechaIngreso,
				fechaSalida: form.fechaSalida || null,
				estadoVisita: { id: Number(form.estadoId) },
				apartamento: { id: Number(form.apartamentoId) },
			};

			if (editId) {
				await visitasApi.update(editId, v);
			} else {
				await visitasApi.create(v);
			}

			setOpen(false);
			setEditId(null);
			setForm(initial);
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	const edit = (x) => {
		setForm({
			tipoVisitaId: x.tipoVisita?.id ?? "",
			tipoDocumentoId: x.tipoDocumento?.id ?? "",
			nombreVisitante: x.nombreVisitante,
			documentoVisitante: x.documentoVisitante,
			motivoVisita: x.motivoVisita ?? "",
			fechaIngreso: x.fechaIngreso?.slice(0, 16) ?? "",
			fechaSalida: x.fechaSalida?.slice(0, 16) ?? "",
			estadoId: x.estadoVisita?.id ?? "1",
			apartamentoId: x.apartamento?.id ?? "",
		});
		setEditId(x.id);
		setOpen(true);
	};

	const finish = async (id) => {
		try {
			await finalizarVisita(id);
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	const remove = async (id) => {
		if (confirm("¿Eliminar visita?")) {
			try {
				await visitasApi.remove(id);
				load();
			} catch (e) {
				setError(e.message);
			}
		}
	};

	const filtered = items.filter((x) =>
		`${x.nombreVisitante} ${x.documentoVisitante} ${x.apartamento?.numeroApartamento}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);

	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Visitas</h1>
					<p className="module-subtitle">
						Controla el ingreso y salida de visitantes.
					</p>
				</div>
				<button
					className="primary-btn"
					onClick={() => {
						setForm({
							...initial,
							fechaIngreso: new Date().toISOString().slice(0, 16),
						});
						setEditId(null);
						setError("");
						setOpen(true);
					}}
				>
					+ Registrar visita
				</button>
			</div>

			<div className="card-panel">
				<div className="toolbar">
					<strong>{items.length} visitas</strong>
					<input
						className="search-input"
						placeholder="Buscar visitante..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="table-wrap">
					<table className="module-table">
						<thead>
							<tr>
								<th>Visitante</th>
								<th>Tipo</th>
								<th>Apartamento</th>
								<th>Ingreso</th>
								<th>Salida</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length ? (
								filtered.map((x) => (
									<tr key={x.id}>
										<td>
											<strong>{x.nombreVisitante}</strong>
											<br />
											<small>{x.documentoVisitante}</small>
										</td>
										<td>{x.tipoVisita?.nombre}</td>
										<td>
											{x.apartamento?.torre?.nombreTorre} - {x.apartamento?.numeroApartamento}
										</td>
										<td>{fmt(x.fechaIngreso)}</td>
										<td>{fmt(x.fechaSalida)}</td>
										<td>
											<span
												className={`badge ${
													x.estadoVisita?.nombre === "Finalizada"
														? "badge-success"
														: x.estadoVisita?.nombre === "Cancelada"
															? "badge-danger"
															: "badge-info"
												}`}
											>
												{x.estadoVisita?.nombre}
											</span>
										</td>
										<td className="actions-cell">
											{x.estadoVisita?.nombre !== "Finalizada" && (
												<button
													className="small-btn"
													onClick={() => finish(x.id)}
												>
													Finalizar
												</button>
											)}{" "}
											<button className="small-btn" onClick={() => edit(x)}>
												Editar
											</button>{" "}
											<button
												className="danger-btn small-btn"
												onClick={() => remove(x.id)}
											>
												Eliminar
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="7" className="empty-row">
										No hay visitas.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{open && (
				<Modal
					title={editId ? "Editar visita" : "Registrar visita"}
					onClose={() => setOpen(false)}
				>
					<form onSubmit={submit}>
						{error && <div className="form-error">{error}</div>}
						<div className="form-grid">
							<div className="form-group">
								<label>Tipo de visita</label>
								<select
									required
									value={form.tipoVisitaId}
									onChange={(e) =>
										setForm({ ...form, tipoVisitaId: e.target.value })
									}
								>
									<option value="">Seleccione...</option>
									{tipos.map((x) => (
										<option key={x.id} value={x.id}>
											{x.nombre}
										</option>
									))}
								</select>
							</div>

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
									{apts.map((x) => (
										<option key={x.id} value={x.id}>
											{x.torre?.nombreTorre} - {x.numeroApartamento}
										</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label>Tipo de documento</label>
								<select
									required
									value={form.tipoDocumentoId}
									onChange={(e) =>
										setForm({ ...form, tipoDocumentoId: e.target.value })
									}
								>
									<option value="">Seleccione...</option>
									{docs.map((x) => (
										<option key={x.id} value={x.id}>
											{x.nombre}
										</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label>Documento</label>
								<input
									required
									maxLength="30"
									value={form.documentoVisitante}
									onChange={(e) =>
										setForm({ ...form, documentoVisitante: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Nombre completo</label>
								<input
									required
									maxLength="100"
									value={form.nombreVisitante}
									onChange={(e) =>
										setForm({ ...form, nombreVisitante: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Motivo</label>
								<input
									maxLength="150"
									value={form.motivoVisita}
									onChange={(e) =>
										setForm({ ...form, motivoVisita: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Ingreso</label>
								<input
									required
									type="datetime-local"
									value={form.fechaIngreso}
									onChange={(e) =>
										setForm({ ...form, fechaIngreso: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Salida</label>
								<input
									type="datetime-local"
									min={form.fechaIngreso}
									value={form.fechaSalida}
									onChange={(e) =>
										setForm({ ...form, fechaSalida: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Estado</label>
								<select
									required
									value={form.estadoId}
									onChange={(e) =>
										setForm({ ...form, estadoId: e.target.value })
									}
								>
									{estados.map((x) => (
										<option key={x.id} value={x.id}>
											{x.nombre}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-footer">
							<button className="primary-btn">Guardar visita</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
}
