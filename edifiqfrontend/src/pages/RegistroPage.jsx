import { useEffect, useState } from "react";
import { getPersonas, getRoles, registrarUsuario } from "../api";

const initialForm = { idPersona: "", idRol: "", username: "", password: "" };

function RegistroPage() {
  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    getPersonas().then(setPersonas);
    getRoles().then(setRoles);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      persona: { id: form.idPersona },
      rol: { id: form.idRol },
      username: form.username,
      password: form.password,
    };
    try {
      await registrarUsuario(payload);
      setMensaje("Usuario registrado correctamente ✅");
      setForm(initialForm);
    } catch {
      setMensaje("Error al registrar el usuario ❌");
    }
  };

  return (
    <div className="crud-container">
      <h2 className="crud-title">Registro de Usuario</h2>

      <form onSubmit={handleSubmit} className="crud-form">
        <select name="idPersona" value={form.idPersona} onChange={handleChange} required>
          <option value="">-- Selecciona una persona --</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
          ))}
        </select>

        <select name="idRol" value={form.idRol} onChange={handleChange} required>
          <option value="">-- Selecciona un rol --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>

        <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />

        <button type="submit">Registrar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default RegistroPage;