'use client';
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function ChangeEmail({username}) {
  //! OBTENER LOS DATOS DEL USUARIO CAMBIARÁ CUANDO SE HAGA LO DE AUTENTICACIÓN!
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch(
        `http://localhost:8080/api/Usuario/getByUsername/${username}`
      );
      const data = await response.json();
      setUser(data); // Setea el user
    }

    fetchUserData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/Usuarios/updateEmail/${username}/${formData.newEmail}`,
        { method: "PUT" }
      );

      const message = await response.json();

      if (message.status === 400) {
        alert("Ha habido un error");
      }

      if (message.status === 200) {
        alert("Se ha actualizado su correo.");
        // Aquí se puede agregar el cierre de sesión y redirección
      }
    } catch (exc) {
      alert("Ha habido un error con algo: " + exc.message);
    }
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  }

  return (
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Cambiar el correo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="currentEmail" className="form-label">Correo Actual</label>
            <input
              type="email"
              id="currentEmail"
              className="form-control"
              value={user?.email} // ESTE VALUE SE ESTABLECERÁ CUANDO SE TENGAN LOS DATOS DEL USUARIO!
              disabled
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="newEmail" className="form-label">Nuevo Correo</label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              className="form-control"
              placeholder="Ingrese su nuevo correo electrónico"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            ¡Cambiar el Correo!
          </button>
        </form>
    </div>
  );
}
