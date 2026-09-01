import { useEffect, useState } from "react";
import {
  crearPersona,
  getPersonaPorDocumento,
  registrarUsuarioResidente,
  getTiposDocumento
} from "../api";

export default function RegistroResidente() {
  const [step, setStep] = useState(1);
  const [idPersona, setIdPersona] = useState(null);
  const [error, setError] = useState("");
  const [tiposDocumento, setTiposDocumento] = useState([]);

  const [persona, setPersona] = useState({
    idTipoDocumento: "",
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: ""
  });

  const [credenciales, setCredenciales] = useState({
    username: "",
    password: "",
    confirmar: ""
  });

  useEffect(() => {
    getTiposDocumento()
      .then((data) => setTiposDocumento(data))
      .catch(() =>
        setError("No se pudieron cargar los tipos de documento")
      );
  }, []);

  const handlePersonaChange = (e) =>
    setPersona({ ...persona, [e.target.name]: e.target.value });

  const handlePasoUno = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const personaExistente = await getPersonaPorDocumento(
        persona.numeroDocumento
      );

      setIdPersona(personaExistente.id);
      setStep(2);
      return;
    } catch {
      // Si no existe, se crea
    }

    try {
      const nuevaPersona = await crearPersona({
        tipoDocumento: {
          id: persona.idTipoDocumento
        },
        numeroDocumento: persona.numeroDocumento,
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        telefono: persona.telefono,
        correo: persona.correo,
        activo: true
      });

      setIdPersona(nuevaPersona.id);
      setStep(2);
    } catch {
      setError("No se pudo registrar la persona. Verifica los datos.");
    }
  };

  const handlePasoDos = async (e) => {
    e.preventDefault();
    setError("");

    if (credenciales.password !== credenciales.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await registrarUsuarioResidente({
        idPersona,
        username: credenciales.username,
        password: credenciales.password
      });

      alert("Registro completado");
    } catch (err) {
      setError(
        err.message || "No se pudo registrar el usuario"
      );
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {step === 1 && (
        <form onSubmit={handlePasoUno}>
          <h3>Paso 1: Datos personales</h3>

          <select
            name="idTipoDocumento"
            value={persona.idTipoDocumento}
            onChange={handlePersonaChange}
            required
          >
            <option value="">
              Seleccione tipo de documento
            </option>

            {tiposDocumento.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>

          <input
            name="numeroDocumento"
            placeholder="Número de documento"
            value={persona.numeroDocumento}
            onChange={handlePersonaChange}
            required
          />

          <input
            name="nombres"
            placeholder="Nombres"
            value={persona.nombres}
            onChange={handlePersonaChange}
            required
          />

          <input
            name="apellidos"
            placeholder="Apellidos"
            value={persona.apellidos}
            onChange={handlePersonaChange}
            required
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            value={persona.telefono}
            onChange={handlePersonaChange}
          />

          <input
            name="correo"
            type="email"
            placeholder="Correo"
            value={persona.correo}
            onChange={handlePersonaChange}
            required
          />

          <button type="submit">
            Siguiente
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePasoDos}>
          <h3>Paso 2: Crear cuenta</h3>

          <input
            placeholder="Usuario"
            value={credenciales.username}
            onChange={(e) =>
              setCredenciales({
                ...credenciales,
                username: e.target.value
              })
            }
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={credenciales.password}
            onChange={(e) =>
              setCredenciales({
                ...credenciales,
                password: e.target.value
              })
            }
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={credenciales.confirmar}
            onChange={(e) =>
              setCredenciales({
                ...credenciales,
                confirmar: e.target.value
              })
            }
            required
          />

          <button type="submit">
            Registrarme
          </button>
        </form>
      )}
    </div>
  );
}