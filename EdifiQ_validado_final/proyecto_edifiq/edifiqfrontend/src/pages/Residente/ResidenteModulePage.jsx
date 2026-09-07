import { useEffect, useState } from "react";
import {
  getApartamentoDePersona, paquetesApi, recibosApi, reservasApi, visitasApi,
  pagarRecibo, cancelarReserva, zonasApi, getTiposVisita, getTiposDocumento
} from "../../api";
import { sanitizeName, sanitizeDocument, sanitizeText } from "../../utils/validation";
import "../../styles/modules.css";
import Modal from "../../componentes/Modal";

const emptyForm = {
  fechaReserva: "", horaInicio: "", horaFin: "", cantidadInvitados: 0,
  zonaId: "", tipoVisitaId: "", tipoDocumentoId: "",
  nombreVisitante: "", documentoVisitante: "", motivoVisita: "", fechaIngreso: ""
};

export default function ResidenteModulePage({ type }) {
  const user = JSON.parse(localStorage.getItem("authUser") || "null");
  const personaId = user?.persona?.id;

  const [apt, setApt] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(personaId));
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({ zonas: [], tiposVisita: [], documentos: [] });
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [zonas, tiposVisita, documentos] = await Promise.all([
          zonasApi.list(), getTiposVisita(), getTiposDocumento()
        ]);
        if (!cancelled) setOptions({ zonas, tiposVisita, documentos });

        if (!personaId) {
          if (!cancelled) {
            setError("No se encontró la persona asociada a la sesión.");
            setLoading(false);
          }
          return;
        }

        const relation = await getApartamentoDePersona(personaId);
        if (cancelled) return;

        setApt(relation);
        if (!relation) {
          setItems([]);
          setLoading(false);
          return;
        }

        const apartamentoId = relation.apartamento?.id;
        const listFunction = {
          paquetes: paquetesApi.list,
          reservas: reservasApi.list,
          recibos: recibosApi.list,
          visitas: visitasApi.list
        }[type];

        if (!listFunction) throw new Error("Módulo no válido.");

        const data = await listFunction();
        if (!cancelled) setItems(data.filter((x) => x.apartamento?.id === apartamentoId));
      } catch (e) {
        if (!cancelled) setError(e.message || "No se pudo cargar la información.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [type, personaId]);

  const create = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (type === "reservas") {
        if (!form.zonaId || !form.fechaReserva || !form.horaInicio || !form.horaFin) {
          throw new Error("Completa todos los campos obligatorios.");
        }
        if (Number(form.cantidadInvitados) < 0 || Number(form.cantidadInvitados) > 1000) {
          throw new Error("La cantidad de invitados debe estar entre 0 y 1000.");
        }
        if (form.horaFin <= form.horaInicio) {
          throw new Error("La hora final debe ser posterior a la inicial.");
        }

        await reservasApi.create({
          fechaReserva: form.fechaReserva,
          horaInicio: form.horaInicio,
          horaFin: form.horaFin,
          cantidadInvitados: Number(form.cantidadInvitados),
          estadoReserva: { id: 1 },
          zona: { id: Number(form.zonaId) },
          apartamento: { id: apt.apartamento?.id || apt.id }
        });
      } else {
        if (!form.tipoVisitaId || !form.tipoDocumentoId || !form.fechaIngreso) {
          throw new Error("Completa todos los campos obligatorios.");
        }
        if (!/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(form.nombreVisitante.trim())) {
          throw new Error("El nombre solo puede contener letras, espacios, apóstrofes y guiones.");
        }
        if (!/^[A-Za-z0-9.-]{3,30}$/.test(form.documentoVisitante)) {
          throw new Error("El documento contiene caracteres no permitidos.");
        }

        await visitasApi.create({
          tipoVisita: { id: Number(form.tipoVisitaId) },
          tipoDocumento: { id: Number(form.tipoDocumentoId) },
          nombreVisitante: form.nombreVisitante.trim().replace(/\s+/g, " ").toUpperCase(),
          documentoVisitante: form.documentoVisitante.trim().toUpperCase(),
          motivoVisita: form.motivoVisita.trim(),
          fechaIngreso: form.fechaIngreso,
          fechaSalida: null,
          estadoVisita: { id: 1 },
          apartamento: { id: apt.apartamento?.id || apt.id }
        });
      }

      setOpen(false);
      window.location.reload();
    } catch (e) {
      setError(e.message || "No fue posible guardar el registro.");
    }
  };

  if (loading) {
    return <div className="module-page"><div className="card-panel">Cargando información...</div></div>;
  }

  if (!apt) {
    return <div className="module-page"><div className="card-panel">
      <h2>Mi apartamento</h2>
      <p>{error || "Tu usuario aún no tiene un apartamento asignado."}</p>
    </div></div>;
  }

  const a = apt.apartamento || apt;
  const titles = {
    paquetes: ["Mis paquetes", "Consulta los paquetes recibidos en tu apartamento."],
    recibos: ["Mis recibos", "Consulta tus cobros y registra pagos."],
    reservas: ["Mis reservas", "Consulta y administra tus reservas."],
    visitas: ["Mis visitas", "Consulta las visitas asociadas a tu apartamento."]
  };
  const [title, subtitle] = titles[type];

  const pay = async (id) => {
    try { await pagarRecibo(id); window.location.reload(); }
    catch (e) { setError(e.message); }
  };

  const cancel = async (id) => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    try { await cancelarReserva(id); window.location.reload(); }
    catch (e) { setError(e.message); }
  };

  const openCreate = () => {
    setError("");
    setForm({ ...emptyForm, fechaIngreso: new Date().toISOString().slice(0, 16) });
    setOpen(true);
  };

  return (
    <div className="module-page">
      <div className="module-header">
        <div><h1 className="module-title">{title}</h1><p className="module-subtitle">{subtitle}</p></div>
        <div className="module-actions">
          {(type === "reservas" || type === "visitas") &&
            <button className="primary-btn" onClick={openCreate}>+ {type === "reservas" ? "Nueva reserva" : "Registrar visita"}</button>}
          <span className="badge badge-info">{a.torre?.nombreTorre} · {a.numeroApartamento}</span>
        </div>
      </div>

      <div className="card-panel">
        {error && <div className="form-error" role="alert">{error}</div>}

        {type === "paquetes" && <table className="module-table">
          <thead><tr><th>Descripción</th><th>Remitente</th><th>Recepción</th><th>Entrega</th><th>Estado</th></tr></thead>
          <tbody>{items.length ? items.map(x => <tr key={x.id}>
            <td>{x.descripcion}</td><td>{x.remitente}</td>
            <td>{x.fechaRecepcion?.replace("T", " ").slice(0, 16)}</td>
            <td>{x.fechaEntrega?.replace("T", " ").slice(0, 16) || "Pendiente"}</td>
            <td><span className={`badge ${x.estadoPaquete?.nombre === "Entregado" ? "badge-success" : "badge-warning"}`}>{x.estadoPaquete?.nombre}</span></td>
          </tr>) : <tr><td colSpan="5" className="empty-row">No tienes paquetes registrados.</td></tr>}</tbody>
        </table>}

        {type === "recibos" && <table className="module-table">
          <thead><tr><th>Servicio</th><th>Periodo</th><th>Valor</th><th>Vencimiento</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>{items.length ? items.map(x => <tr key={x.id}>
            <td>{x.tipoServicio?.nombre}</td><td>{x.periodo}</td><td>${Number(x.valor).toLocaleString("es-CO")}</td>
            <td>{x.fechaVencimiento}</td><td><span className={`badge ${x.estadoRecibo?.nombre === "Pagado" ? "badge-success" : "badge-warning"}`}>{x.estadoRecibo?.nombre}</span></td>
            <td>{x.estadoRecibo?.nombre !== "Pagado" && <button className="small-btn" onClick={() => pay(x.id)}>Marcar como pagado</button>}</td>
          </tr>) : <tr><td colSpan="6" className="empty-row">No tienes recibos.</td></tr>}</tbody>
        </table>}

        {type === "reservas" && <table className="module-table">
          <thead><tr><th>Zona</th><th>Fecha</th><th>Horario</th><th>Invitados</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>{items.length ? items.map(x => <tr key={x.id}>
            <td>{x.zona?.nombre}</td><td>{x.fechaReserva}</td><td>{x.horaInicio?.slice(0, 5)} - {x.horaFin?.slice(0, 5)}</td>
            <td>{x.cantidadInvitados}</td><td><span className={`badge ${x.estadoReserva?.nombre === "Cancelada" ? "badge-danger" : "badge-info"}`}>{x.estadoReserva?.nombre}</span></td>
            <td>{x.estadoReserva?.nombre !== "Cancelada" && <button className="small-btn" onClick={() => cancel(x.id)}>Cancelar</button>}</td>
          </tr>) : <tr><td colSpan="6" className="empty-row">No tienes reservas.</td></tr>}</tbody>
        </table>}

        {type === "visitas" && <table className="module-table">
          <thead><tr><th>Visitante</th><th>Tipo</th><th>Motivo</th><th>Ingreso</th><th>Salida</th><th>Estado</th></tr></thead>
          <tbody>{items.length ? items.map(x => <tr key={x.id}>
            <td>{x.nombreVisitante}</td><td>{x.tipoVisita?.nombre}</td><td>{x.motivoVisita || "—"}</td>
            <td>{x.fechaIngreso?.replace("T", " ").slice(0, 16)}</td><td>{x.fechaSalida?.replace("T", " ").slice(0, 16) || "—"}</td>
            <td><span className="badge badge-info">{x.estadoVisita?.nombre}</span></td>
          </tr>) : <tr><td colSpan="6" className="empty-row">No tienes visitas.</td></tr>}</tbody>
        </table>}
      </div>

      {open && <Modal title={type === "reservas" ? "Nueva reserva" : "Registrar visita"} onClose={() => setOpen(false)}>
        <form onSubmit={create} noValidate>
          <div className="form-grid">
            {type === "reservas" ? <>
              <div className="form-group"><label>Zona común</label>
                <select required value={form.zonaId} onChange={e => setForm({ ...form, zonaId: e.target.value })}>
                  <option value="">Seleccione...</option>{options.zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Fecha</label><input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.fechaReserva} onChange={e => setForm({ ...form, fechaReserva: e.target.value })}/></div>
              <div className="form-group"><label>Hora inicio</label><input required type="time" value={form.horaInicio} onChange={e => setForm({ ...form, horaInicio: e.target.value })}/></div>
              <div className="form-group"><label>Hora fin</label><input required type="time" value={form.horaFin} onChange={e => setForm({ ...form, horaFin: e.target.value })}/></div>
              <div className="form-group"><label>Invitados</label><input type="number" min="0" max="1000" value={form.cantidadInvitados} onChange={e => setForm({ ...form, cantidadInvitados: e.target.value.replace(/\D/g, "").slice(0, 4) })}/></div>
            </> : <>
              <div className="form-group"><label>Tipo de visita</label>
                <select required value={form.tipoVisitaId} onChange={e => setForm({ ...form, tipoVisitaId: e.target.value })}>
                  <option value="">Seleccione...</option>{options.tiposVisita.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Tipo de documento</label>
                <select required value={form.tipoDocumentoId} onChange={e => setForm({ ...form, tipoDocumentoId: e.target.value })}>
                  <option value="">Seleccione...</option>{options.documentos.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Nombre del visitante</label><input required maxLength="100" value={form.nombreVisitante} onChange={e => setForm({ ...form, nombreVisitante: sanitizeName(e.target.value) })}/></div>
              <div className="form-group"><label>Documento</label><input required maxLength="30" value={form.documentoVisitante} onChange={e => setForm({ ...form, documentoVisitante: sanitizeDocument(e.target.value, 30) })}/></div>
              <div className="form-group full"><label>Motivo</label><input maxLength="150" value={form.motivoVisita} onChange={e => setForm({ ...form, motivoVisita: sanitizeText(e.target.value, 150) })}/></div>
              <div className="form-group"><label>Ingreso</label><input required type="datetime-local" value={form.fechaIngreso} onChange={e => setForm({ ...form, fechaIngreso: e.target.value })}/></div>
            </>}
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="form-footer"><button className="primary-btn">Guardar</button></div>
        </form>
      </Modal>}
    </div>
  );
}
