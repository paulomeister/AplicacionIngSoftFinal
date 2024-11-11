"use client";
import { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "app/app/context/AuthContext";
import axios from "axios";

export function ChangeEmail({ username }) {

  const { user, notificacionDeError, notificacionDeExito, clientKey } = useContext(AuthContext);

  const [DATA, setFormData] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

     try {
      const response = await axios.put(
        `http://localhost:8080/api/Usuarios/updateEmail/${user.username.toString().trim()}/${DATA.newEmail.toString().trim()}`,{},
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlc3RlbGEubnVuZXoiLCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU1VBUklPIn1dLCJpYXQiOjE3MzEzNDA5MjAsImV4cCI6MTczMTM4NzYwMH0.-P3mrQxQCAWeYacyNC5j5zoUeiCNzruZKzWNqvH2Pl3Sh_InTjC5jSPpCQYU2qS4YsquoxswKhcgB_W_nQl4GQ",
          },
        }
      );

      const message = response.data;
      
      notificacionDeExito(message)
      setTimeout(()=>{
        window.location.href=`/users/${user.username.toString().trim()}`
      }, 5000)


      if (message.status === 400) {
        notificacionDeError("Ha habido un error");
      }

      if (message.status === 200) {
        notificacionDeError("Se ha actualizado su correo.");
        // Aquí se puede agregar el cierre de sesión y redirección
      }
    } catch (exc) {
      notificacionDeError("Ha habido un error con algo: " + exc.message);
    }
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...DATA, [name]: value });
  }

  return (
    <div className="card shadow p-4" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Cambiar el correo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="currentEmail" className="form-label">
            Correo Actual
          </label>
          <input
            type="email"
            id="currentEmail"
            className="form-control"
            value={user?.email} // ESTE VALUE SE ESTABLECERÁ CUANDO SE TENGAN LOS DATOS DEL USUARIO!
            disabled
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="newEmail" className="form-label">
            Nuevo Correo
          </label>
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
