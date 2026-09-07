import { useEffect, useState } from "react";
import { crearPersona, registrarUsuarioResidente, getTiposDocumento } from "../api";
import { sanitizeName, sanitizeDocument, sanitizePhone, sanitizeUsername, validatePerson, validateCredentials } from "../utils/validation";

export default function RegistroResidente() {
  const [step, setStep] = useState(1);
  const [idPersona, setIdPersona] = useState(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [tiposDocumento, setTiposDocumento] = useState([]);

  const [persona, setPersona] = useState({
    idTipoDocumento: "", numeroDocumento: "", nombres: "", apellidos: "", telefono: "", correo: ""
  });
  const [credenciales, setCredenciales] = useState({ username: "", password: "", confirmar: "" });

  useEffect(() => {
    getTiposDocumento().then(setTiposDocumento)
      .catch(() => setError("No se pudieron cargar los tipos de documento."));
  }, []);

  const handlePersonaChange = (e) => {
    const { name, value } = e.target;
    let limpio = value;
    if (name === "nombres" || name === "apellidos") limpio = sanitizeName(value);
    if (name === "numeroDocumento") limpio = sanitizeDocument(value, 20);
    if (name === "telefono") limpio = sanitizePhone(value);
    if (name === "correo") limpio = value.replace(/\s/g, "").slice(0, 100);
    setPersona((actual) => ({ ...actual, [name]: limpio }));
  };

  const handlePasoUno = async (e) => {
    e.preventDefault(); setError(""); setOk("");
    const validacion = validatePerson(persona);
    if (validacion) return setError(validacion);

    try {
      const nuevaPersona = await crearPersona({
        tipoDocumento: { id: Number(persona.idTipoDocumento) },
        numeroDocumento: persona.numeroDocumento.trim().toUpperCase(),
        nombres: persona.nombres.trim().replace(/\s+/g, " ").toUpperCase(),
        apellidos: persona.apellidos.trim().replace(/\s+/g, " ").toUpperCase(),
        telefono: persona.telefono || null,
        correo: persona.correo.trim().toLowerCase(),
        activo: true
      });
      setIdPersona(nuevaPersona.id); setStep(2);
    } catch (err) {
      setError(err.message || "No fue posible completar el registro con los datos proporcionados.");
    }
  };

  const handlePasoDos = async (e) => {
    e.preventDefault(); setError(""); setOk("");
    const validacion = validateCredentials(credenciales);
    if (validacion) return setError(validacion);

    try {
      await registrarUsuarioResidente({ idPersona, username: credenciales.username.trim(), password: credenciales.password });
      setOk("Registro completado correctamente. Ya puedes iniciar sesión.");
      setCredenciales({ username: "", password: "", confirmar: "" });
    } catch (err) {
      setError(err.message || "No fue posible crear la cuenta.");
    }
  };

  return (
    <div className="auth-page">
      {error && <p className="auth-error" role="alert">{error}</p>}
      {ok && <p className="badge badge-success" role="status">{ok}</p>}
      {step === 1 && <form onSubmit={handlePasoUno} className="auth-form" noValidate>
        <h3>Paso 1: Datos personales</h3>
        <select name="idTipoDocumento" value={persona.idTipoDocumento} onChange={handlePersonaChange} required>
          <option value="">Seleccione tipo de documento</option>
          {tiposDocumento.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
        </select>
        <input name="numeroDocumento" placeholder="Número de documento" value={persona.numeroDocumento} onChange={handlePersonaChange} maxLength="20" required />
        <input name="nombres" placeholder="Nombres" value={persona.nombres} onChange={handlePersonaChange} maxLength="100" required />
        <input name="apellidos" placeholder="Apellidos" value={persona.apellidos} onChange={handlePersonaChange} maxLength="100" required />
        <input name="telefono" inputMode="numeric" placeholder="Teléfono" value={persona.telefono} onChange={handlePersonaChange} maxLength="10" />
        <input name="correo" type="email" placeholder="Correo" value={persona.correo} onChange={handlePersonaChange} maxLength="100" required />
        <button type="submit">Siguiente</button>
      </form>}
      {step === 2 && <form onSubmit={handlePasoDos} className="auth-form" noValidate>
        <h3>Paso 2: Crear cuenta</h3>
        <input name="username" placeholder="Usuario" value={credenciales.username}
          onChange={(e) => setCredenciales((c) => ({ ...c, username: sanitizeUsername(e.target.value) }))}
          minLength="4" maxLength="50" required />
        <input name="password" type="password" minLength="6" maxLength="72" placeholder="Contraseña"
          value={credenciales.password} onChange={(e) => setCredenciales((c) => ({ ...c, password: e.target.value }))} required />
        <input name="confirmar" type="password" minLength="6" maxLength="72" placeholder="Confirmar contraseña"
          value={credenciales.confirmar} onChange={(e) => setCredenciales((c) => ({ ...c, confirmar: e.target.value }))} required />
        <button type="submit">Registrarme</button>
      </form>}
    </div>
  );
}
