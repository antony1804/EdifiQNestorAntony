import { useEffect, useState } from "react";
import Modal from "../../componentes/Modal";
import {
	recibosApi,
	apartamentosApi,
	getTiposServicio,
	getEstadosRecibo,
	pagarRecibo,
} from "../../api";
import { onlyDecimal } from "../../utils/validation";
import "../../styles/modules.css";

const initial = {
	tipoServicioId: "",
	periodo: "",
	valor: "",
	fechaEmision: "",
	fechaVencimiento: "",
	estadoId: "1",
	apartamentoId: "",
};

const money = (v) =>
	new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(Number(v || 0));

export default function RecibosPage() {
	const [items, setItems] = useState([]);
	const [apts, setApts] = useState([]);
	const [servicios, setServicios] = useState([]);
	const [estados, setEstados] = useState([]);
	const [form, setForm] = useState(initial);
	const [editId, setEditId] = useState(null);
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");

	const load = () =>
		recibosApi.list().then(setItems).catch((e) => setError(e.message));

	useEffect(() => {
		load();
		apartamentosApi.list().then(setApts);
		getTiposServicio().then(setServicios);
		getEstadosRecibo().then(setEstados);
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const p = {
				tipoServicio: { id: Number(form.tipoServicioId) },
				periodo: form.periodo.trim(),
				valor: Number(form.valor),
				fechaEmision: form.fechaEmision,
				fechaVencimiento: form.fechaVencimiento,
				estadoRecibo: { id: Number(form.estadoId) },
				apartamento: { id: Number(form.apartamentoId) },
			};

			if (editId) {
				await recibosApi.update(editId, p);
			} else {
				await recibosApi.create(p);
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
			tipoServicioId: x.tipoServicio?.id ?? "",
			periodo: x.periodo,
			valor: x.valor,
			fechaEmision: x.fechaEmision,
			fechaVencimiento: x.fechaVencimiento,
			estadoId: x.estadoRecibo?.id ?? "1",
			apartamentoId: x.apartamento?.id ?? "",
		});
		setEditId(x.id);
		setOpen(true);
	};

	const pay = async (id) => {
		try {
			await pagarRecibo(id);
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	const remove = async (id) => {
		if (confirm("¿Eliminar recibo?")) {
			try {
				await recibosApi.remove(id);
				load();
			} catch (e) {
				setError(e.message);
			}
		}
	};

	const filtered = items.filter((x) =>
		`${x.periodo} ${x.tipoServicio?.nombre} ${x.apartamento?.numeroApartamento}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);

	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Recibos</h1>
					<p className="module-subtitle">
						Gestiona los cobros y estados de pago.
					</p>
				</div>
				<button
					className="primary-btn"
					onClick={() => {
						setForm(initial);
						setEditId(null);
						setError("");
						setOpen(true);
					}}
				>
					+ Crear recibo
				</button>
			</div>

			<div className="card-panel">
				<div className="toolbar">
					<strong>{items.length} recibos</strong>
					<input
						className="search-input"
						placeholder="Buscar recibo..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className="table-wrap">
					<table className="module-table">
						<thead>
							<tr>
								<th>Servicio</th>
								<th>Periodo</th>
								<th>Valor</th>
								<th>Apartamento</th>
								<th>Vencimiento</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length ? (
								filtered.map((x) => (
									<tr key={x.id}>
										<td>{x.tipoServicio?.nombre}</td>
										<td>{x.periodo}</td>
										<td>{money(x.valor)}</td>
										<td>
											{x.apartamento?.torre?.nombreTorre} - {x.apartamento?.numeroApartamento}
										</td>
										<td>{x.fechaVencimiento}</td>
										<td>
											<span
												className={`badge ${
													x.estadoRecibo?.nombre === "Pagado"
														? "badge-success"
														: "badge-warning"
												}`}
											>
												{x.estadoRecibo?.nombre}
											</span>
										</td>
										<td className="actions-cell">
											{x.estadoRecibo?.nombre !== "Pagado" && (
												<button
													className="small-btn"
													onClick={() => pay(x.id)}
												>
													Marcar pagado
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
										No hay recibos.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{open && (
				<Modal
					title={editId ? "Editar recibo" : "Crear recibo"}
					onClose={() => setOpen(false)}
				>
					<form onSubmit={submit}>
						{error && <div className="form-error">{error}</div>}
						<div className="form-grid">
							<div className="form-group">
								<label>Servicio</label>
								<select
									required
									value={form.tipoServicioId}
									onChange={(e) =>
										setForm({ ...form, tipoServicioId: e.target.value })
									}
								>
									<option value="">Seleccione...</option>
									{servicios.map((x) => (
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
								<label>Periodo</label>
								<input
									required
									maxLength="20"
									placeholder="Ej. Septiembre 2026"
									value={form.periodo}
									onChange={(e) => setForm({ ...form, periodo: e.target.value })}
								/>
							</div>

							<div className="form-group">
								<label>Valor</label>
								<input
									required
									type="number"
									min="0.01"
									step="0.01"
									value={form.valor}
									onChange={(e) => setForm({ ...form, valor: onlyDecimal(e.target.value) })}
								/>
							</div>

							<div className="form-group">
								<label>Fecha emisión</label>
								<input
									required
									type="date"
									value={form.fechaEmision}
									onChange={(e) =>
										setForm({ ...form, fechaEmision: e.target.value })
									}
								/>
							</div>

							<div className="form-group">
								<label>Fecha vencimiento</label>
								<input
									required
									type="date"
									min={form.fechaEmision}
									value={form.fechaVencimiento}
									onChange={(e) =>
										setForm({ ...form, fechaVencimiento: e.target.value })
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
							<button className="primary-btn">Guardar</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
}
