import { useEffect, useState } from "react";
import {
  getPersonas, crearPersona, actualizarPersona, eliminarPersona, getTiposDocumento
} from "../api";
import { sanitizeName, sanitizeDocument, sanitizePhone, validatePerson } from "../utils/validation";
import "../App.css";

const initialForm = {
  idTipoDocumento: "", numeroDocumento: "", nombres: "", apellidos: "",
  correo: "", telefono: "", activo: true,
};

function PersonaPages() {
  const [personas, setPersonas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const cargar = () => getPersonas().then(setPersonas).catch((e) => setError(e.message));
  useEffect(() => {
    cargar();
    getTiposDocumento().then(setTiposDocumento).catch((e) => setError(e.message));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let next = type === "checkbox" ? checked : value;
    if (name === "nombres" || name === "apellidos") next = sanitizeName(value);
    if (name === "numeroDocumento") next = sanitizeDocument(value, 20);
    if (name === "telefono") next = sanitizePhone(value);
    if (name === "correo") next = value.replace(/\s/g, "").slice(0, 100);
    setForm((actual) => ({ ...actual, [name]: next }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setOk("");

    const validacion = validatePerson(form);
    if (validacion) { setError(validacion); return; }

    const payload = {
      tipoDocumento: { id: Number(form.idTipoDocumento) },
      numeroDocumento: form.numeroDocumento.trim().toUpperCase(),
      nombres: form.nombres.trim().replace(/\s+/g, " ").toUpperCase(),
      apellidos: form.apellidos.trim().replace(/\s+/g, " ").toUpperCase(),
      correo: form.correo.trim().toLowerCase(),
      telefono: form.telefono || null,
      activo: form.activo,
    };

    try {
      if (editId) {
        await actualizarPersona(editId, payload);
        setOk("Persona actualizada correctamente.");
      } else {
        await crearPersona(payload);
        setOk("Persona registrada correctamente.");
      }
      setEditId(null);
      setForm(initialForm);
      cargar();
    } catch (e) {
      setError(e.message || "No fue posible guardar la persona.");
    }
  };

  const handleEdit = (p) => {
    setError(""); setOk("");
    setForm({
      idTipoDocumento: p.tipoDocumento?.id ?? "",
      numeroDocumento: p.numeroDocumento ?? "",
      nombres: p.nombres ?? "",
      apellidos: p.apellidos ?? "",
      correo: p.correo ?? "",
      telefono: p.telefono ?? "",
      activo: p.activo ?? true,
    });
    setEditId(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta persona?")) return;
    try {
      await eliminarPersona(id); cargar();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="crud-container">
      <h2 className="crud-title">Gestión de Personas</h2>
      <form onSubmit={handleSubmit} className="crud-form" noValidate>
        <select name="idTipoDocumento" value={form.idTipoDocumento} onChange={handleChange} required>
          <option value="">-- Tipo de documento --</option>
          {tiposDocumento.map((t) => <option key={t.id} value={t.id}>{t.nombre} ({t.abreviatura})</option>)}
        </select>
        <input name="numeroDocumento" inputMode="text" placeholder="Número de documento"
          value={form.numeroDocumento} onChange={handleChange} maxLength={20} required />
        <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} maxLength={100} required />
        <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} maxLength={100} required />
        <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} maxLength={100} required />
        <input name="telefono" inputMode="numeric" placeholder="Teléfono" value={form.telefono} onChange={handleChange} maxLength={10} />
        <label className="crud-checkbox"><input name="activo" type="checkbox" checked={form.activo} onChange={handleChange} /> Activo</label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {ok && <p className="badge badge-success">{ok}</p>}
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
      </form>

      <table className="crud-table">
        <thead><tr>
          <th>ID</th><th>Tipo Doc.</th><th>N° Documento</th><th>Nombres</th><th>Apellidos</th>
          <th>Correo</th><th>Teléfono</th><th>Activo</th><th>Acciones</th>
        </tr></thead>
        <tbody>
          {personas.length === 0 ? <tr><td colSpan="9" className="crud-empty">No hay personas registradas todavía.</td></tr> :
            personas.map((p) => <tr key={p.id}>
              <td>{p.id}</td><td>{p.tipoDocumento?.abreviatura}</td><td>{p.numeroDocumento}</td>
              <td>{p.nombres}</td><td>{p.apellidos}</td><td>{p.correo}</td><td>{p.telefono}</td>
              <td>{p.activo ? "Sí" : "No"}</td>
              <td><button className="btn-edit" type="button" onClick={() => handleEdit(p)}>Editar</button>
                <button className="btn-delete" type="button" onClick={() => handleDelete(p.id)}>Eliminar</button></td>
            </tr>)}
        </tbody>
      </table>
    </div>
  );
}
export default PersonaPages;
