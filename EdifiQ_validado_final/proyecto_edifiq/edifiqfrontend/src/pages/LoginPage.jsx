import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../api";
import { sanitizeUsername, usernameRegex } from "../utils/validation";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.name === "username" ? sanitizeUsername(e.target.value) : e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!usernameRegex.test(form.username.trim()) || form.username.trim().length < 4) {
      setError("Ingresa un usuario válido.");
      return;
    }
    if (!form.password) {
      setError("Ingresa tu contraseña.");
      return;
    }

    try {
      const usuario = await loginUsuario(form);

      localStorage.setItem("authUser", JSON.stringify(usuario));

      const rol = usuario.rol?.nombre?.toLowerCase();

      if (rol === "residente") {
        navigate("/residente");
      } else if (rol === "administrador") {
        navigate("/admin");
      }else if (rol === "vigilante") {
        navigate("/vigilante");
      }  else {
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
          autoComplete="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          autoComplete="current-password"
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

