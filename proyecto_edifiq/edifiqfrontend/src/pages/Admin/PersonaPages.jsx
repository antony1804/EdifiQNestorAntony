import { useEffect, useState } from "react";
import Modal from "../../componentes/Modal";
import { getPersonas, crearPersona, actualizarPersona, getTiposDocumento } from "../../api";
import "../vigilante.css";
import "../../styles/modules.css";

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
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");

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

    // El backend valida numeroDocumento/nombres/apellidos/tipoDocumento como
    // obligatorios en el PUT, así que siempre se reenvían. En edición esos
    // campos están bloqueados en la UI (disabled/readOnly), así que viajan
    // sin cambios; el admin solo puede modificar correo, teléfono y activo.
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
    setShowModal(false);
  };

  const abrirNuevo = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(true);
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
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(initialForm);
  };

  const handleToggleActivo = async (p) => {
    const confirmMsg = p.activo
      ? `¿Marcar a ${p.nombres} ${p.apellidos} como inactivo?`
      : `¿Marcar a ${p.nombres} ${p.apellidos} como activo?`;
    if (!confirm(confirmMsg)) return;

    await actualizarPersona(p.id, {
      tipoDocumento: { id: p.tipoDocumento?.id },
      numeroDocumento: p.numeroDocumento,
      nombres: p.nombres,
      apellidos: p.apellidos,
      correo: p.correo,
      telefono: p.telefono,
      activo: !p.activo,
    });
    cargar();
  };

  const personasFiltradas = personas.filter((p) => {
    const texto = `${p.numeroDocumento} ${p.nombres} ${p.apellidos} ${p.correo || ""} ${p.telefono || ""}`
      .toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const tipoDocumentoSeleccionado = tiposDocumento.find(
    (t) => t.id === Number(form.idTipoDocumento)
  );

  return (
    <div className="personas-container">
      <div className="personas-header">
        <div>
          <h2 className="personas-title">Gestión de Personas</h2>
          <p className="personas-subtitle">Administra los residentes y sus datos de contacto.</p>
        </div>
        <button type="button" className="personas-add-btn" onClick={abrirNuevo}>
          <span aria-hidden="true">+</span>
          <span>Nueva persona</span>
        </button>
      </div>

      <div className="toolbar personas-toolbar">
        <strong>{personasFiltradas.length} personas</strong>
        <input
          className="search-input"
          placeholder="Buscar por nombre, apellido, documento, correo o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="personas-table-wrap">
      <table className="personas-table">
        <thead>
          <tr>
            <th>ID</th><th>Tipo Doc.</th><th>N° Documento</th><th>Nombres</th><th>Apellidos</th><th>Correo</th><th>Teléfono</th><th>Activo</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="9" className="personas-empty">
                {personas.length === 0
                  ? "No hay personas registradas todavía."
                  : "Ninguna persona coincide con la búsqueda."}
              </td>
            </tr>
          ) : (
            personasFiltradas.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.tipoDocumento?.abreviatura}</td>
                <td>{p.numeroDocumento}</td>
                <td>{p.nombres}</td>
                <td>{p.apellidos}</td>
                <td>{p.correo}</td>
                <td>{p.telefono}</td>
                <td>
                  <span className={`badge ${p.activo ? "badge-success" : "badge-danger"}`}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>{" "}
                  <button
                    className={p.activo ? "btn-delete" : "btn-edit"}
                    onClick={() => handleToggleActivo(p)}
                  >
                    {p.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {showModal && (
        <Modal
          title={editId ? "Editar persona" : "Nueva persona"}
          onClose={cerrarModal}
        >
          <form onSubmit={handleSubmit} className="personas-form personas-modal-form">
            {editId && (
              <p className="form-hint">
                Los datos de identidad (documento y nombre) no se pueden modificar. Solo puedes actualizar el contacto y el estado.
              </p>
            )}

            <div className="form-group">
              <label htmlFor="idTipoDocumento">Tipo de documento</label>
              {editId ? (
                <input
                  value={
                    tipoDocumentoSeleccionado
                      ? `${tipoDocumentoSeleccionado.nombre} (${tipoDocumentoSeleccionado.abreviatura})`
                      : ""
                  }
                  disabled
                  readOnly
                />
              ) : (
                <select id="idTipoDocumento" name="idTipoDocumento" value={form.idTipoDocumento} onChange={handleChange} required>
                  <option value="">Seleccione una opción</option>
                  {tiposDocumento.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre} ({t.abreviatura})</option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="numeroDocumento">Número de documento</label>
              <input
                id="numeroDocumento"
                name="numeroDocumento"
                value={form.numeroDocumento}
                onChange={handleChange}
                required={!editId}
                disabled={!!editId}
                readOnly={!!editId}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input
                id="nombres"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                required={!editId}
                disabled={!!editId}
                readOnly={!!editId}
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required={!editId}
                disabled={!!editId}
                readOnly={!!editId}
              />
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo</label>
              <input id="correo" name="correo" type="email" value={form.correo} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
            </div>
            <label className="personas-checkbox">
              <input name="activo" type="checkbox" checked={form.activo} onChange={handleChange} />
              <span>Persona activa</span>
            </label>
            <div className="personas-modal-actions">
              <button type="button" className="secondary-btn" onClick={cerrarModal}>Cancelar</button>
              <button type="submit" className="primary-btn">{editId ? "Actualizar" : "Crear persona"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default PersonaPages;