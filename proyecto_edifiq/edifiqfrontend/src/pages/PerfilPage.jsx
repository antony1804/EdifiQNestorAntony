import { useEffect, useState } from "react";
import { getTiposDocumento, personasApi, actualizarPerfilUsuario } from "../api";
import { onlyLetters, onlyNumbers } from "../utils/validation";
import "../styles/modules.css";

export default function PerfilPage() {
	const [user, setUser] = useState(() =>
		JSON.parse(localStorage.getItem("authUser") || "null"),
	);
	const [tiposDocumento, setTiposDocumento] = useState([]);

	const [datos, setDatos] = useState({
		tipoDocumentoId: "",
		numeroDocumento: "",
		nombres: "",
		apellidos: "",
		telefono: "",
		correo: "",
	});
	const [errorDatos, setErrorDatos] = useState("");
	const [okDatos, setOkDatos] = useState("");

	const [cuenta, setCuenta] = useState({
		username: "",
		passwordActual: "",
		passwordNueva: "",
		confirmarPassword: "",
	});
	const [errorCuenta, setErrorCuenta] = useState("");
	const [okCuenta, setOkCuenta] = useState("");

	useEffect(() => {
		getTiposDocumento().then(setTiposDocumento);
		if (user?.persona) {
			setDatos({
				tipoDocumentoId: user.persona.tipoDocumento?.id ?? "",
				numeroDocumento: user.persona.numeroDocumento ?? "",
				nombres: user.persona.nombres ?? "",
				apellidos: user.persona.apellidos ?? "",
				telefono: user.persona.telefono ?? "",
				correo: user.persona.correo ?? "",
			});
		}
		setCuenta((c) => ({ ...c, username: user?.username ?? "" }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!user) {
		return (
			<div className="module-page">
				<div className="card-panel">No se encontró la sesión.</div>
			</div>
		);
	}

	const guardarDatos = async (e) => {
		e.preventDefault();
		setErrorDatos("");
		setOkDatos("");
		try {
			const p = {
				tipoDocumento: { id: Number(datos.tipoDocumentoId) },
				numeroDocumento: datos.numeroDocumento.trim(),
				nombres: datos.nombres.trim(),
				apellidos: datos.apellidos.trim(),
				telefono: datos.telefono.trim(),
				correo: datos.correo.trim(),
				activo: user.persona.activo,
			};
			const actualizada = await personasApi.update(user.persona.id, p);
			const nuevoUser = { ...user, persona: actualizada };
			localStorage.setItem("authUser", JSON.stringify(nuevoUser));
			setUser(nuevoUser);
			setOkDatos("Tus datos se actualizaron correctamente.");
		} catch (err) {
			setErrorDatos(err.message);
		}
	};

	const guardarCuenta = async (e) => {
		e.preventDefault();
		setErrorCuenta("");
		setOkCuenta("");

		if (cuenta.passwordNueva && cuenta.passwordNueva !== cuenta.confirmarPassword) {
			setErrorCuenta("Las contraseñas nuevas no coinciden.");
			return;
		}

		try {
			const actualizado = await actualizarPerfilUsuario(user.id, {
				username: cuenta.username.trim(),
				passwordActual: cuenta.passwordActual,
				passwordNueva: cuenta.passwordNueva || null,
			});
			const nuevoUser = { ...user, username: actualizado.username };
			localStorage.setItem("authUser", JSON.stringify(nuevoUser));
			setUser(nuevoUser);
			setCuenta({
				username: actualizado.username,
				passwordActual: "",
				passwordNueva: "",
				confirmarPassword: "",
			});
			setOkCuenta("Tu usuario y/o contraseña se actualizaron correctamente.");
		} catch (err) {
			setErrorCuenta(err.message);
		}
	};

	return (
		<div className="module-page">
			<div className="module-header">
				<div>
					<h1 className="module-title">Mi perfil</h1>
					<p className="module-subtitle">
						Actualiza tus datos personales, tu usuario y tu contraseña.
					</p>
				</div>
				<span className="badge badge-info">{user.rol?.nombre}</span>
			</div>

			<div className="card-panel">
				<h2>Datos personales</h2>
				{errorDatos && <div className="form-error">{errorDatos}</div>}
				{okDatos && <div className="form-success">{okDatos}</div>}
				<form onSubmit={guardarDatos}>
					<div className="form-grid">
						<div className="form-group">
							<label>Tipo de documento</label>
							<select
								required
								value={datos.tipoDocumentoId}
								onChange={(e) =>
									setDatos({ ...datos, tipoDocumentoId: e.target.value })
								}
							>
								<option value="">Seleccione...</option>
								{tiposDocumento.map((t) => (
									<option key={t.id} value={t.id}>
										{t.nombre}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label>Número de documento</label>
							<input
								required
								maxLength="20"
								inputMode="numeric"
								value={datos.numeroDocumento}
								onChange={(e) =>
									setDatos({ ...datos, numeroDocumento: onlyNumbers(e.target.value) })
								}
							/>
						</div>

						<div className="form-group">
							<label>Nombres</label>
							<input
								required
								maxLength="100"
								value={datos.nombres}
								onChange={(e) => setDatos({ ...datos, nombres: onlyLetters(e.target.value) })}
							/>
						</div>

						<div className="form-group">
							<label>Apellidos</label>
							<input
								required
								maxLength="100"
								value={datos.apellidos}
								onChange={(e) =>
									setDatos({ ...datos, apellidos: onlyLetters(e.target.value) })
								}
							/>
						</div>

						<div className="form-group">
							<label>Teléfono</label>
							<input
								maxLength="20"
								inputMode="numeric"
								value={datos.telefono}
								onChange={(e) => setDatos({ ...datos, telefono: onlyNumbers(e.target.value) })}
							/>
						</div>

						<div className="form-group">
							<label>Correo</label>
							<input
								type="email"
								maxLength="100"
								value={datos.correo}
								onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
							/>
						</div>
					</div>

					<div className="form-footer">
						<button className="primary-btn">Guardar datos</button>
					</div>
				</form>
			</div>

			<div className="card-panel">
				<h2>Usuario y contraseña</h2>
				{errorCuenta && <div className="form-error">{errorCuenta}</div>}
				{okCuenta && <div className="form-success">{okCuenta}</div>}
				<form onSubmit={guardarCuenta}>
					<div className="form-grid">
						<div className="form-group">
							<label>Usuario</label>
							<input
								required
								minLength="4"
								maxLength="50"
								value={cuenta.username}
								onChange={(e) => setCuenta({ ...cuenta, username: e.target.value })}
							/>
						</div>

						<div className="form-group">
							<label>Contraseña actual</label>
							<input
								required
								type="password"
								value={cuenta.passwordActual}
								onChange={(e) => setCuenta({ ...cuenta, passwordActual: e.target.value })}
							/>
						</div>

						<div className="form-group">
							<label>Nueva contraseña (opcional)</label>
							<input
								type="password"
								minLength="6"
								value={cuenta.passwordNueva}
								onChange={(e) => setCuenta({ ...cuenta, passwordNueva: e.target.value })}
							/>
						</div>

						<div className="form-group">
							<label>Confirmar nueva contraseña</label>
							<input
								type="password"
								minLength="6"
								value={cuenta.confirmarPassword}
								onChange={(e) =>
									setCuenta({ ...cuenta, confirmarPassword: e.target.value })
								}
							/>
						</div>
					</div>

					<p className="module-subtitle">
						Deja los campos de nueva contraseña vacíos si solo quieres cambiar el usuario.
						Siempre debes confirmar tu contraseña actual.
					</p>

					<div className="form-footer">
						<button className="primary-btn">Guardar cambios</button>
					</div>
				</form>
			</div>
		</div>
	);
}
