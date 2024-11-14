"use client";
import { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "app/app/context/AuthContext";

export function ChangePassword({ username }) {
  const { notificacionDeExito, clientKey,notificacionDeError, cerrarSesion} = useContext(AuthContext);

  /////////////
  //! OBTENER LOS DATOS DEL USUARIO CAMBIARÁ CUANDO SE HAGA LO DE AUTENTICACIÓN!
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch(
        `http://localhost:8080/api/Usuarios/getByUsername/${username}`
      );
      const data = await response.json();
      setUser(data); // Setea el user
    }

    fetchUserData();
  }, []);
  //////////////////////////////////////////////////////////////////////////////////
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(false);
  const [actualPassword, setActualPassword] = useState("");

  function handleChange(e) {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "actualPassword") {
      setActualPassword(value);
    }

    if (name === "confirmPassword") {
      setError(value !== formData.newPassword);
    }
    if (name === "newPassword") {
      setError(value !== formData.confirmPassword);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validar si las contraseñas coinciden antes de enviar
    if (formData.newPassword !== formData.confirmPassword) {
      setError(true);
      return;
    }

    try {
      console.log(user);
      const passwordActual = actualPassword;
      const passwordNuevo = formData.newPassword;
      console.log(`${passwordActual}\n ${passwordNuevo}`)

      // ! Se debe de enviar un objeto de asi: {}

      const response = await fetch("http://localhost:8080/password/change", {
        method: "POST",
        body: JSON.stringify({
          passwordActual,
          passwordNuevo,
        }),
        headers: {
          Authorization: clientKey,
          "Content-Type": "application/json",
        },
      });
      const data = response.text();
      console.log(data);
      console.log(response.status);
      if(response.status == 400) {
        throw Error("La contraseña nueva ingresada ya ha sido usada anteriormente")
      } else {
        notificacionDeExito("Contraseña cambiada exitosamente.");
        setTimeout(() => {
          cerrarSesion();
        }, 5000);
      }
      // aqui se hace la petición para cambiar la contraseña
    } catch (error) {
      notificacionDeError(`${error}`);
    }
  }

  return (
    <div className="card shadow p-4" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group mb-3">
          <label htmlFor="actualPassword" className="form-label">
            Contraseña actual
          </label>
          <input
            type="password"
            id="actualPassword"
            name="actualPassword"
            className="form-control"
            placeholder="Ingrese su contraseña actual"
            onChange={handleChange}
            value={actualPassword}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="newPassword" className="form-label">
            Nueva Contraseña
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="form-control"
            placeholder="Ingrese su nueva contraseña"
            onChange={handleChange}
            value={formData.newPassword}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Repita su nueva contraseña"
            onChange={handleChange}
            value={formData.confirmPassword}
            required
          />
          {error && (
            <div className="invalid-feedback">
              Las contraseñas no coinciden.
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
}
