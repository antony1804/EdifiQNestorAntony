// Validaciones compartidas del frontend.
// La API vuelve a validar todo en Spring Boot: nunca se confía únicamente en el navegador.

export const sanitizeName = (value) =>
  value.replace(/[^\p{L}\s'-]/gu, "").replace(/\s{2,}/g, " ").slice(0, 100);

export const sanitizeDocument = (value, max = 30) =>
  value.replace(/[^a-zA-Z0-9.-]/g, "").slice(0, max).toUpperCase();

export const sanitizePhone = (value) =>
  value.replace(/\D/g, "").slice(0, 10);

export const sanitizeUsername = (value) =>
  value.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 50);

export const sanitizeText = (value, max) =>
  value.replace(/[<>`]/g, "").replace(/\p{C}/gu, "").slice(0, max);

export const sanitizePeriod = (value) =>
  value.replace(/[^\p{L}\p{N}\s/_-]/gu, "").replace(/\s{2,}/g, " ").slice(0, 20);

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
export const documentRegex = /^[A-Za-z0-9.-]+$/;
export const usernameRegex = /^[A-Za-z0-9._-]+$/;
export const phoneRegex = /^[0-9]{7,10}$/;

export function validatePerson(form) {
  if (!form.idTipoDocumento) return "Selecciona un tipo de documento.";
  if (!documentRegex.test(form.numeroDocumento) || form.numeroDocumento.length < 5 || form.numeroDocumento.length > 20)
    return "El documento debe tener entre 5 y 20 caracteres válidos.";
  if (!nameRegex.test(form.nombres.trim()) || form.nombres.trim().length < 2)
    return "Los nombres solo pueden contener letras, espacios, apóstrofes y guiones.";
  if (!nameRegex.test(form.apellidos.trim()) || form.apellidos.trim().length < 2)
    return "Los apellidos solo pueden contener letras, espacios, apóstrofes y guiones.";
  if (form.telefono && !phoneRegex.test(form.telefono))
    return "El teléfono debe contener únicamente números y tener entre 7 y 10 dígitos.";
  if (!emailRegex.test(form.correo.trim().toLowerCase()))
    return "Ingresa un correo electrónico válido.";
  return "";
}

export function validateCredentials(form) {
  const username = form.username.trim();
  if (!usernameRegex.test(username) || username.length < 4 || username.length > 50)
    return "El usuario debe tener entre 4 y 50 caracteres y solo puede usar letras, números, punto, guion y guion bajo.";
  if (form.password.length < 6 || form.password.length > 72)
    return "La contraseña debe tener entre 6 y 72 caracteres.";
  if (form.confirmar !== undefined && form.password !== form.confirmar)
    return "Las contraseñas no coinciden.";
  return "";
}

export function validatePositiveNumber(value, label = "El valor") {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return `${label} debe ser mayor que 0.`;
  return "";
}
