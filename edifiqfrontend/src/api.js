const BASE_URL = "http://localhost:8080/api";
const PERSONAS_URL = `${BASE_URL}/personas`;
const TIPOS_DOCUMENTO_URL = `${BASE_URL}/tipos-documento`;

export const getPersonas = () => fetch(PERSONAS_URL).then(r => r.json());

export const getTiposDocumento = () => fetch(TIPOS_DOCUMENTO_URL).then(r => r.json());

export const crearPersona = (p) => fetch(PERSONAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p)
}).then(r => r.json());

export const actualizarPersona = (id, p) => fetch(`${PERSONAS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p)
}).then(r => r.json());

export const eliminarPersona = (id) => fetch(`${PERSONAS_URL}/${id}`, {
    method: "DELETE"
});