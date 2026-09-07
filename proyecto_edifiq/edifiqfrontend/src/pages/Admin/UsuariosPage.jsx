import { useEffect, useState } from "react";
import { getPersonas, getRoles, registrarUsuario } from "../../api";
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
			</div>

			<div className="card-panel">
				<form onSubmit={submit}>
					<div className="form-grid">
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
										{p.nombres} {p.apellidos}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label>Rol</label>
							<select
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
							<label>Usuario</label>
							<input
								required
								minLength="4"
								maxLength="50"
								value={form.username}
								onChange={(e) => setForm({ ...form, username: e.target.value })}
							/>
						</div>

						<div className="form-group">
							<label>Contraseña</label>
							<input
								required
								minLength="6"
								type="password"
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
							/>
						</div>
					</div>

					{error && <div className="form-error">{error}</div>}
					{ok && <div className="badge badge-success">{ok}</div>}

					<div className="form-footer">
						<button className="primary-btn">Crear usuario</button>
					</div>
				</form>
			</div>

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
