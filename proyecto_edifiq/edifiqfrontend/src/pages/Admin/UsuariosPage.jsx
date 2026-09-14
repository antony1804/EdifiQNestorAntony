import { useEffect, useState } from "react";
import { getPersonas, getRoles, registrarUsuario } from "../../api";
import Modal from "../../componentes/Modal";
import "../../styles/modules.css";

export default function UsuariosPage() {
	const [personas, setPersonas] = useState([]);
	const [roles, setRoles] = useState([]);
	const [users, setUsers] = useState([]);
	const [form, setForm] = useState({
		username: "",
		password: "",
		personaId: "",
		rolId: "",
	});
	const [error, setError] = useState("");
	const [ok, setOk] = useState("");
	const [open, setOpen] = useState(false);

	const load = () =>
		fetch("http://localhost:8080/api/usuarios")
			.then((r) => r.json())
			.then(setUsers);

	useEffect(() => {
		getPersonas().then(setPersonas);
		getRoles().then(setRoles);
		load();
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setError("");
		setOk("");

		try {
			await registrarUsuario({
				username: form.username.trim(),
				password: form.password,
				persona: { id: Number(form.personaId) },
				rol: { id: Number(form.rolId) },
			});
			setOk("Usuario creado correctamente.");
			setForm({ username: "", password: "", personaId: "", rolId: "" });
			setOpen(false);
			load();
		} catch (e) {
			setError(e.message);
		}
	};

	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Usuarios</h1>
					<p className="module-subtitle">
						Crea cuentas para administradores, vigilantes y residentes.
					</p>
				</div>
				<button
					type="button"
					className="primary-btn"
					onClick={() => {
						setError("");
						setOk("");
						setForm({ username: "", password: "", personaId: "", rolId: "" });
						setOpen(true);
					}}
				>
					+ Crear usuario
				</button>
			</div>

			{ok && <div className="form-success">{ok}</div>}

			{open && <Modal title="Crear usuario" onClose={() => setOpen(false)}>
				<form onSubmit={submit}>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="usuario-persona">Persona</label>
							<select
								id="usuario-persona"
								required
								value={form.personaId}
								onChange={(e) => setForm({ ...form, personaId: e.target.value })}
							>
								<option value="">Seleccione...</option>
								{personas.map((p) => (
									<option key={p.id} value={p.id}>
										{p.nombres} {p.apellidos}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="usuario-rol">Rol</label>
							<select
								id="usuario-rol"
								required
								value={form.rolId}
								onChange={(e) => setForm({ ...form, rolId: e.target.value })}
							>
								<option value="">Seleccione...</option>
								{roles.map((r) => (
									<option key={r.id} value={r.id}>
										{r.nombre}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="usuario-username">Usuario</label>
							<input
								id="usuario-username"
								required
								minLength="4"
								maxLength="50"
								value={form.username}
								onChange={(e) => setForm({ ...form, username: e.target.value })}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="usuario-password">Contraseña</label>
							<input
								id="usuario-password"
								required
								minLength="6"
								type="password"
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
							/>
						</div>
					</div>

					{error && <div className="form-error">{error}</div>}
					<div className="form-footer">
						<button type="button" className="secondary-btn" onClick={() => setOpen(false)}>
							Cancelar
						</button>
						<button type="submit" className="primary-btn">Crear usuario</button>
					</div>
				</form>
			</Modal>}

			<div className="card-panel" style={{ marginTop: 20 }}>
				<div className="table-wrap">
					<table className="module-table">
						<thead>
							<tr>
								<th>Usuario</th>
								<th>Persona</th>
								<th>Rol</th>
								<th>Estado</th>
							</tr>
						</thead>
						<tbody>
							{users.map((u) => (
								<tr key={u.id}>
									<td>{u.username}</td>
									<td>
										{u.persona?.nombres} {u.persona?.apellidos}
									</td>
									<td>{u.rol?.nombre}</td>
									<td>
										<span className="badge badge-success">
											{u.estadoUsuario?.nombre}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
