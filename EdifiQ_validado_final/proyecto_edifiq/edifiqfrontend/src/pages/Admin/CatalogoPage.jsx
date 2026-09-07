import { useEffect, useState } from "react";
import Modal from "../../componentes/Modal";
import "../../styles/modules.css";
import { sanitizeText, nameRegex } from "../../utils/validation";

export default function CatalogoPage({ title, subtitle, api, fields }) {
    const initial = Object.fromEntries(fields.map((f) => [f.name, ""]));
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(initial);
    const [editId, setEditId] = useState(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const validateField = (field, value) => {
        const clean = value.trim();
        if (!clean) return `${field.label} es obligatorio.`;
        if (field.name === "nombreTorre" || field.name === "nombre") {
            if (!nameRegex.test(clean)) return `${field.label} solo puede contener letras, números, espacios y guiones.`;
        }
        if (field.name === "descripcion" && clean.length < 3) return "La descripción debe tener al menos 3 caracteres.";
        return "";
    };


    const load = () => api.list().then(setItems).catch((e) => setError(e.message));

    // Corrección del useEffect
    useEffect(() => {
        load();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        for (const field of fields) {
            const validation = validateField(field, form[field.name]);
            if (validation) {
                setError(validation);
                return;
            }
        }

        try {
            if (editId) {
                await api.update(editId, form);
            } else {
                await api.create(form);
            }

            setOpen(false);
            setEditId(null);
            setForm(initial);
            load();
        } catch (e) {
            setError(e.message);
        }
    };

    const edit = (x) => {
        setForm(Object.fromEntries(fields.map((f) => [f.name, x[f.name] ?? ""])));
        setEditId(x.id);
        setOpen(true);
    };

    const remove = async (id) => {
        if (confirm("¿Eliminar este registro?")) {
            try {
                await api.remove(id);
                load();
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h1 className="module-title">{title}</h1>
                    <p className="module-subtitle">{subtitle}</p>
                </div>
                <button
                    className="primary-btn"
                    onClick={() => {
                        setForm(initial);
                        setEditId(null);
                        setError("");
                        setOpen(true);
                    }}
                >
                    + Nuevo
                </button>
            </div>

            <div className="card-panel">
                <div className="table-wrap">
                    <table className="module-table">
                        <thead>
                            <tr>
                                {fields.map((f) => (
                                    <th key={f.name}>{f.label}</th>
                                ))}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length ? (
                                items.map((x) => (
                                    <tr key={x.id}>
                                        {fields.map((f) => (
                                            <td key={f.name}>{x[f.name]}</td>
                                        ))}
                                        <td>
                                            <button className="small-btn" onClick={() => edit(x)}>
                                                Editar
                                            </button>{" "}
                                            <button
                                                className="danger-btn small-btn"
                                                onClick={() => remove(x.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={fields.length + 1} className="empty-row">
                                        No hay registros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {open && (
                <Modal
                    title={editId ? "Editar" : "Nuevo"}
                    onClose={() => setOpen(false)}
                >
                    <form onSubmit={submit}>
                        {error && <div className="form-error">{error}</div>}
                        <div className="form-grid">
                            {fields.map((f) => (
                                <div className="form-group" key={f.name}>
                                    <label>{f.label}</label>
                                    {f.type === "textarea" ? (
                                        <textarea
                                            required
                                            value={form[f.name]}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [f.name]: sanitizeText(e.target.value, f.maxLength || 255)
                                                })
                                            }
                                        />
                                    ) : (
                                        <input
                                            required
                                            maxLength={f.maxLength}
                                            value={form[f.name]}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    [f.name]: sanitizeText(e.target.value, f.maxLength || 255)
                                                })
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="form-footer">
                            <button className="primary-btn">Guardar</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}