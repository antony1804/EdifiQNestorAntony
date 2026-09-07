import { useEffect, useState } from "react";
import Modal from "../../componentes/Modal";
import { paquetesApi, apartamentosApi, entregarPaquete } from "../../api";
import "../../styles/modules.css";

const initial = {
	descripcion: "",
	remitente: "",
	apartamentoId: "",
};

const fmt = (d) => (d ? new Date(d).toLocaleString("es-CO") : "—");

const estaPendiente = (x) => x.estadoPaquete?.nombre?.toLowerCase() !== "entregado";

export default function VigilantePaquetesPage() {
	const [items, setItems] = useState([]);
	const [apts, setApts] = useState([]);
	const [form, setForm] = useState(initial);
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [soloPendientes, setSoloPendientes] = useState(true);

	const load = () =>
		paquetesApi.list().then(setItems).catch((e) => setError(e.message));

	useEffect(() => {
		load();
		apartamentosApi.list().then(setApts);
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const p = {
				descripcion: form.descripcion.trim(),
				remitente: form.remitente.trim(),
				fechaRecepcion: new Date().toISOString().slice(0, 19),
				estadoPaquete: { id: 1 },
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

	const entregar = async (id) => {
		try {
			await entregarPaquete(id);
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	const filtered = items
		.filter((x) => (soloPendientes ? estaPendiente(x) : true))
		.filter((x) =>
			`${x.descripcion} ${x.remitente} ${x.apartamento?.numeroApartamento}`
				.toLowerCase()
				.includes(search.toLowerCase()),
		)
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
						setForm(initial);
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
					<input
						className="search-input"
						placeholder="Buscar..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
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
												<button className="small-btn" onClick={() => entregar(x.id)}>
													Entregar
												</button>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="empty-row">
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
									value={form.remitente}
									onChange={(e) =>
										setForm({ ...form, remitente: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Apartamento destino</label>
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
						</div>

						<div className="form-footer">
							<button className="primary-btn">Registrar paquete</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
}
