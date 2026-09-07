const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.error
        ? data.error
        : typeof data === "object"
          ? Object.values(data || {})[0] || "No se pudo completar la operación"
          : data || "No se pudo completar la operación";
    throw new Error(message);
  }
  return data;
}

const crud = (name) => {
  const url = `${BASE_URL}/${name}`;
  return {
    list: () => request(url),
    get: (id) => request(`${url}/${id}`),
    create: (data) => request(url, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`${url}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`${url}/${id}`, { method: "DELETE" }),
  };
};

export const personasApi = crud("personas");
export const apartamentosApi = crud("apartamentos");
export const paquetesApi = crud("paquetes");
export const recibosApi = crud("recibos");
export const reservasApi = crud("reservas");
export const visitasApi = crud("visitas");
export const torresApi = crud("torres");
export const zonasApi = crud("zonas");
export const asignacionesApi = crud("apartamentos-personas");

export const getPersonas = () => personasApi.list();
export const getTiposDocumento = () => request(`${BASE_URL}/tipos-documento`);
export const getTiposResidente = () => request(`${BASE_URL}/tipos-residente`);
export const getTiposVisita = () => request(`${BASE_URL}/tipos-visita`);
export const getEstadosVisita = () => request(`${BASE_URL}/estados-visita`);
export const getEstadosPaquete = () => request(`${BASE_URL}/estados-paquete`);
export const getTiposServicio = () => request(`${BASE_URL}/tipos-servicio`);
export const getEstadosRecibo = () => request(`${BASE_URL}/estados-recibo`);
export const getEstadosReserva = () => request(`${BASE_URL}/estados-reserva`);
export const getRoles = () => request(`${BASE_URL}/roles`);

export const getPersonaPorDocumento = (numeroDocumento) =>
  request(`${BASE_URL}/personas/documento/${encodeURIComponent(numeroDocumento)}`);

export const crearPersona = (p) => personasApi.create(p);
export const actualizarPersona = (id, p) => personasApi.update(id, p);
export const eliminarPersona = (id) => personasApi.remove(id);

export const registrarUsuario = (u) =>
  request(`${BASE_URL}/usuarios`, { method: "POST", body: JSON.stringify(u) });

export const registrarUsuarioResidente = (datos) =>
  request(`${BASE_URL}/usuarios/registro-residente`, { method: "POST", body: JSON.stringify(datos) });

export const loginUsuario = (credenciales) =>
  request(`${BASE_URL}/usuarios/login`, { method: "POST", body: JSON.stringify(credenciales) });

export const entregarPaquete = (id) =>
  request(`${BASE_URL}/paquetes/${id}/entregar`, { method: "PATCH" });

export const pagarRecibo = (id) =>
  request(`${BASE_URL}/recibos/${id}/pagar`, { method: "PATCH" });

export const cancelarReserva = (id) =>
  request(`${BASE_URL}/reservas/${id}/cancelar`, { method: "PATCH" });

export const finalizarVisita = (id) =>
  request(`${BASE_URL}/visitas/${id}/finalizar`, { method: "PATCH" });

export const getApartamentoDePersona = async (idPersona) => {
  const data = await request(`${BASE_URL}/apartamentos-personas/persona/${idPersona}`);
  return data.find((a) => !a.fechaSalida) || data[0] || null;
};
