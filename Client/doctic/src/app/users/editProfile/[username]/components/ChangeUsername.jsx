'use client';
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function ChangeUsername({username}) {
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Puedes cargar el nombre de usuario actual desde una API si es necesario
    setNewUsername(username);
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!newUsername) {
      setError("El nombre de usuario no puede estar vacío.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/Usuarios/updateUsername/${username}/${newUsername}`, 
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        throw new Error("Error al cambiar el nombre de usuario.");
      }

      const data = await response.json();
      alert("Nombre de usuario actualizado: " + data.message); 
    } catch (exc) {
      alert("Error al cambiar el nombre de usuario: " + exc.message);
    }
  }

  return (
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Cambiar Nombre de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="newUsername" className="form-label">Nuevo Nombre de Usuario</label>
            <input
              type="text"
              id="newUsername"
              className={`form-control ${error ? "is-invalid" : ""}`}
              placeholder="Ingrese su nuevo nombre de usuario"
              onChange={(e) => {
                setNewUsername(e.target.value);
                setError(""); // Limpiar el error si se está escribiendo
              }}
              value={newUsername}
              required
            />
            {error && (
              <div className="invalid-feedback">
                {error}
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
