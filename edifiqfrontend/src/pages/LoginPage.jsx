import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../api";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const usuario = await loginUsuario(form);

      localStorage.setItem("authUser", JSON.stringify(usuario));

      const rol = usuario.rol?.nombre?.toLowerCase();

      if (rol === "residente") {
        navigate("/residente");
      } else if (rol === "administrador") {
        navigate("/admin");
      } else {
        setError("El usuario no tiene un rol válido");
      }

    } catch {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Iniciar sesión</h2>

        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Ingresar</button>

        <Link to="/registro">
          ¿No tienes una cuenta? Regístrate
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;

