"use client";
import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "app/app/context/AuthContext";

export function ChangeUsername({ username }) {
  const { clientKey, notificacionDeExito, notificacionDeError, cerrarSesion } =
    useContext(AuthContext);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setNewUsername(username);
  }, [username]);

  const usernameRegex = /^[a-zA-Z0-9_.]+$/; // Solo permite letras, números, guiones bajos y puntos.

  function handleChange(e) {
    const value = e.target.value;
    setNewUsername(value);

    // Validar si el nuevo nombre de usuario contiene caracteres especiales.
    setError(!usernameRegex.test(value));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (error) {
      notificacionDeError(
        "El nombre de usuario contiene caracteres no permitidos."
      );
      return;
    }

    if (!newUsername) {
      notificacionDeError("El nombre de usuario no puede estar vacío.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/Usuarios/updateUsername/${username}/${newUsername}`,
        {
          method: "PUT",
          headers: {
            Authorization: clientKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cambiar el nombre de usuario.");
      }

      const data = await response.json();
      notificacionDeExito(
        "Nombre de usuario actualizado, se va a cerrar tu sesión en 5 segundos"
      );

      setTimeout(() => {
        cerrarSesion();
      }, 5000);
    } catch (exc) {
      notificacionDeError("Error al cambiar el nombre de usuario");
    }
  }

  return (
    <div className="card shadow p-4" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Cambiar Nombre de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="newUsername" className="form-label">
            Nuevo Nombre de Usuario
          </label>
          <input
            type="text"
            id="newUsername"
            className={`form-control ${error ? "is-invalid" : "is-valid"}`}
            placeholder="Ingrese su nuevo nombre de usuario"
            onChange={handleChange}
            value={newUsername}
            required
          />
          {error && (
            <div className="invalid-feedback">
              El nombre de usuario solo puede contener letras, números, guiones
              bajos (_) y puntos (.).
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Cambiar Nombre de Usuario
        </button>
      </form>
    </div>
  );
}
