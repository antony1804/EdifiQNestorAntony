import { useEffect, useState } from "react";
import Modal from "../../componentes/Modal";
import MultiCriteriaBar from "../../componentes/MultiCriteriaBar";
import {
	paquetesApi,
	apartamentosApi,
	entregarPaquete,
	getPersonasDeApartamento,
	getEstadosPaquete,
} from "../../api";
import { onlyLetters, toLocalDateTimeInput } from "../../utils/validation";
import "../../styles/modules.css";

const initial = {
	descripcion: "",
	remitente: "",
	fechaRecepcion: "",
	fechaEntrega: "",
	estadoId: "1",
	apartamentoId: "",
};

const fmt = (d) => (d ? new Date(d).toLocaleString("es-CO") : "—");

const estaPendiente = (x) => x.estadoPaquete?.nombre?.toLowerCase() !== "entregado";

export default function VigilantePaquetesPage() {
	const [items, setItems] = useState([]);
	const [apts, setApts] = useState([]);
	const [estados, setEstados] = useState([]);
	const [form, setForm] = useState(initial);
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [soloPendientes, setSoloPendientes] = useState(true);
	const [filters, setFilters] = useState({ torre: "", desde: "", hasta: "" });
	const [entrega, setEntrega] = useState({ paquete: null, personas: [], personaId: "", fechaEntrega: "", observacion: "" });

	const load = () =>
		paquetesApi.list().then(setItems).catch((e) => setError(e.message));

	useEffect(() => {
		load();
		apartamentosApi.list().then(setApts);
		getEstadosPaquete().then(setEstados);
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const p = {
				descripcion: form.descripcion.trim(),
				remitente: form.remitente.trim(),
				fechaRecepcion: form.fechaRecepcion,
				fechaEntrega: form.fechaEntrega || null,
				estadoPaquete: { id: Number(form.estadoId) },
				apartamento: { id: Number(form.apartamentoId) },
			};

			await paquetesApi.create(p);

			setOpen(false);
			setForm(initial);
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	const abrirEntrega = async (paquete) => {
		setError("");
		try {
			const relaciones = await getPersonasDeApartamento(paquete.apartamento.id);
			setEntrega({
				paquete,
				personas: relaciones,
				personaId: "",
				fechaEntrega: toLocalDateTimeInput(),
				observacion: "",
			});
		} catch (e) {
			setError(e.message);
		}
	};

	const entregar = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await entregarPaquete(entrega.paquete.id, {
				personaId: Number(entrega.personaId),
				fechaEntrega: entrega.fechaEntrega,
				observacion: entrega.observacion,
			});
			setEntrega({ paquete: null, personas: [], personaId: "", fechaEntrega: "", observacion: "" });
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	const filtered = items
		.filter((x) => (soloPendientes ? estaPendiente(x) : true))
		.filter((x) =>
			`${x.descripcion} ${x.remitente} ${x.apartamento?.numeroApartamento} ${x.apartamento?.torre?.nombreTorre}`
				.toLowerCase()
				.includes(search.toLowerCase()),
		)
		.filter((x) => !filters.torre || String(x.apartamento?.torre?.id) === filters.torre)
		.filter((x) => !filters.desde || x.fechaRecepcion?.slice(0, 10) >= filters.desde)
		.filter((x) => !filters.hasta || x.fechaRecepcion?.slice(0, 10) <= filters.hasta)
		.sort((a, b) => new Date(b.fechaRecepcion) - new Date(a.fechaRecepcion));

	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Gestión de paquetes</h1>
					<p className="module-subtitle">
						Registra los paquetes que llegan y márcalos como entregados.
					</p>
				</div>
				<button
					className="primary-btn"
					onClick={() => {
						setForm({
							...initial,
							fechaRecepcion: toLocalDateTimeInput(),
						});
						setError("");
						setOpen(true);
					}}
				>
					+ Registrar paquete
				</button>
			</div>

			<div className="card-panel">
				<div className="toolbar">
					<strong>{filtered.length} paquetes</strong>
					<label style={{ display: "flex", alignItems: "center", gap: 6 }}>
						<input
							type="checkbox"
							checked={soloPendientes}
							onChange={(e) => setSoloPendientes(e.target.checked)}
						/>
						Solo pendientes
					</label>
					<MultiCriteriaBar
						search={search}
						onSearch={setSearch}
						searchPlaceholder="Descripción, remitente, apartamento o torre..."
						filters={[
							{name: "torre", label: "Torre", type: "select", value: filters.torre, onChange: (value) => setFilters({ ...filters, torre: value }), options: [...new Map(apts.map((x) => [x.torre?.id, x.torre])).values()].filter(Boolean).map((x) => ({ value: x.id, label: x.nombreTorre }))},
							{name: "desde", label: "Recibido desde", type: "date", value: filters.desde, onChange: (value) => setFilters({ ...filters, desde: value })},
							{name: "hasta", label: "Recibido hasta", type: "date", value: filters.hasta, onChange: (value) => setFilters({ ...filters, hasta: value })},
						]}
						onClear={() => { setSearch(""); setFilters({ torre: "", desde: "", hasta: "" }); }}
					/>
				</div>

				<div className="table-wrap">
					<table className="module-table">
						<thead>
							<tr>
								<th>Paquete</th>
								<th>Remitente</th>
								<th>Apartamento</th>
								<th>Recibido</th>
								<th>Recibido por</th>
								<th>Entregado</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length ? (
								filtered.map((x) => (
									<tr key={x.id}>
										<td>{x.descripcion}</td>
										<td>{x.remitente}</td>
										<td>
											{x.apartamento?.torre?.nombreTorre} - {x.apartamento?.numeroApartamento}
										</td>
										<td>{fmt(x.fechaRecepcion)}</td>
										<td>{x.personaEntrega ? `${x.personaEntrega.nombres} ${x.personaEntrega.apellidos}` : "—"}</td>
										<td>{fmt(x.fechaEntrega)}</td>
										<td>
											<span
												className={`badge ${
													!estaPendiente(x) ? "badge-success" : "badge-warning"
												}`}
											>
												{x.estadoPaquete?.nombre}
											</span>
										</td>
										<td className="actions-cell">
											{estaPendiente(x) && (
												<button className="small-btn" onClick={() => abrirEntrega(x)}>
													Entregar
												</button>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="8" className="empty-row">
										No hay paquetes para mostrar.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{open && (
				<Modal title="Registrar paquete" onClose={() => setOpen(false)}>
					<form onSubmit={submit}>
						{error && <div className="form-error">{error}</div>}
						<div className="form-grid">
							<div className="form-group full">
								<label>Descripción</label>
								<input
									required
									maxLength="200"
									value={form.descripcion}
									onChange={(e) =>
										setForm({ ...form, descripcion: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Remitente</label>
								<input
									required
									maxLength="100"
									pattern="[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s'-]+"
									value={form.remitente}
									onChange={(e) => setForm({ ...form, remitente: onlyLetters(e.target.value) })}
								/>
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
									{apts.map((a) => (
										<option key={a.id} value={a.id}>
											{a.torre?.nombreTorre} - {a.numeroApartamento}
										</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label>Recepción</label>
								<input
									required
									type="datetime-local"
									value={form.fechaRecepcion}
									onChange={(e) =>
										setForm({ ...form, fechaRecepcion: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Entrega</label>
								<input
									type="datetime-local"
									value={form.fechaEntrega}
									min={form.fechaRecepcion}
									onChange={(e) =>
										setForm({ ...form, fechaEntrega: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Estado</label>
								<select
									required
									value={form.estadoId}
									onChange={(e) => setForm({ ...form, estadoId: e.target.value })}
								>
									{estados.map((s) => (
										<option key={s.id} value={s.id}>
											{s.nombre}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-footer">
							<button className="primary-btn">Registrar paquete</button>
						</div>
					</form>
				</Modal>
			)}

			{entrega.paquete && (
				<Modal title="Registrar entrega" onClose={() => setEntrega({ ...entrega, paquete: null })}>
					<form onSubmit={entregar}>
						{error && <div className="form-error">{error}</div>}
						<p>Paquete: <strong>{entrega.paquete.descripcion}</strong></p>
						<div className="form-grid">
							<div className="form-group">
								<label>Persona que recibe</label>
								<select required value={entrega.personaId} onChange={(e) => setEntrega({ ...entrega, personaId: e.target.value })}>
									<option value="">Seleccione...</option>
									{entrega.personas.map((relacion) => <option key={relacion.persona.id} value={relacion.persona.id}>{relacion.persona.nombres} {relacion.persona.apellidos} - {relacion.persona.numeroDocumento}</option>)}
								</select>
							</div>
							<div className="form-group">
								<label>Fecha y hora de entrega</label>
								<input required type="datetime-local" min={entrega.paquete.fechaRecepcion?.slice(0, 16)} value={entrega.fechaEntrega} onChange={(e) => setEntrega({ ...entrega, fechaEntrega: e.target.value })} />
							</div>
							<div className="form-group full">
								<label>Observación</label>
								<textarea maxLength="250" value={entrega.observacion} onChange={(e) => setEntrega({ ...entrega, observacion: e.target.value })} />
							</div>
						</div>
						<div className="form-footer"><button type="submit" className="primary-btn">Confirmar entrega</button></div>
					</form>
				</Modal>
			)}
		</div>
	);
}
