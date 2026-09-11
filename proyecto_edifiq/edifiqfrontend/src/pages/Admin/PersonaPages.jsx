import { useEffect, useState } from "react";
import { getPersonas, crearPersona, actualizarPersona, eliminarPersona, getTiposDocumento } from "../../api";
import "../vigilante.css";

const initialForm = { 
  idTipoDocumento: "",
  numeroDocumento: "",
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  activo: true,
};

function PersonaPages() {
  const [personas, setPersonas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const cargar = () => getPersonas().then(setPersonas);
  const cargarTipos = () => getTiposDocumento().then(setTiposDocumento);

  useEffect(() => {
    cargar();
    cargarTipos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tipoDocumento: { id: form.idTipoDocumento },
      numeroDocumento: form.numeroDocumento,
      nombres: form.nombres,
      apellidos: form.apellidos,
      correo: form.correo,
      telefono: form.telefono,
      activo: form.activo,
    };

    if (editId) {
      await actualizarPersona(editId, payload);
      setEditId(null);
    } else {
      await crearPersona(payload);
    }
    setForm(initialForm);
    cargar();
  };

  const handleEdit = (p) => {
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
    await eliminarPersona(id);
    cargar();
  };

  return (
    <div className="crud-container">
      <h2 className="crud-title">Gestión de Personas</h2>

      <form onSubmit={handleSubmit} className="crud-form">
        <select name="idTipoDocumento" value={form.idTipoDocumento} onChange={handleChange} required>
          <option value="">-- Tipo de documento --</option>
          {tiposDocumento.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre} ({t.abreviatura})</option>
          ))}
        </select>
        <input name="numeroDocumento" placeholder="Número de documento" value={form.numeroDocumento} onChange={handleChange} required />
        <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} required />
        <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} required />
        <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <label className="crud-checkbox">
          <input name="activo" type="checkbox" checked={form.activo} onChange={handleChange} />
          Activo
        </label>
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
      </form>

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th><th>Tipo Doc.</th><th>N° Documento</th><th>Nombres</th><th>Apellidos</th><th>Correo</th><th>Teléfono</th><th>Activo</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.length === 0 ? (
            <tr>
              <td colSpan="9" className="crud-empty">No hay personas registradas todavía.</td>
            </tr>
          ) : (
            personas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.tipoDocumento?.abreviatura}</td>
                <td>{p.numeroDocumento}</td>
                <td>{p.nombres}</td>
                <td>{p.apellidos}</td>
                <td>{p.correo}</td>
                <td>{p.telefono}</td>
                <td>{p.activo ? "Sí" : "No"}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PersonaPages;