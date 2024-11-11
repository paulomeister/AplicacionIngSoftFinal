"use client";
import { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "app/app/context/AuthContext";

export function EditProfile({ username }) {
  const {
    notificacionDeError,
    notificacionDeExito,
    user,
    isLoading,
    clientKey,
  } = useContext(AuthContext);
  ////////////////////////////////////////////////////////////////////////////////////////

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fotoPerfil: "",
  });
  const [errors, setErrors] = useState({
    nombre: false,
    apellido: false,
  });

  useEffect(() => {
    if (user?.perfil?.fotoPerfil) {
      const obj = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        fotoPerfil: user?.perfil?.fotoPerfil,
      };

      setFormData(obj);
    }
  }, [user]);

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Solo letras y espacios, sin caracteres especiales

  function handleChange(e) {
    const { name, value } = e.target;

    // Validar el campo y actualizar errores
    if (name === "nombre" || name === "apellido") {
      const isValid = nameRegex.test(value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: !isValid }));
    }

    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Verificar errores antes de enviar
    if (errors.nombre || errors.apellido) {
      notificacionDeError("Por favor, corrija los errores antes de enviar.");
      return;
    }

    const perfil = { ...formData };


    console.log(perfil)


    try {
      const response = await fetch(
        `http://localhost:8080/api/Usuarios/updateProfile/${username}`,
        {
          method: "PUT",
          body: JSON.stringify(perfil),
          headers: {
            "Content-Type": "application/json",
            Authorization: clientKey,
          },
        }
      );
      const data = await response.json();

      if (data.status === 200) {
        notificacionDeExito(data.message + "Recarga la página para ver los cambios"); // mostrar el mensaje de que si se cumplió el cambio
      } else {
        throw new Error(data.message);
      }
    } catch (exc) {

      notificacionDeError(
        "Ha habido un error mientras intentabas actualizar tus datos"
      );
    }
  }

  return (
    !isLoading && (
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Editar Perfil de {username}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className={`form-control ${
                errors.nombre ? "is-invalid" : "is-valid"
              }`}
              placeholder="Ingrese su nombre"
              onChange={handleChange}
              value={formData.nombre}
              required
            />
            {errors.nombre && (
              <div className="invalid-feedback">
                El nombre no puede contener caracteres especiales.
              </div>
            )}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className={`form-control ${
                errors.apellido ? "is-invalid" : "is-valid"
              }`}
              placeholder="Ingrese su apellido"
              onChange={handleChange}
              value={formData.apellido}
              required
            />
            {errors.apellido && (
              <div className="invalid-feedback">
                El apellido no puede contener caracteres especiales.
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Guardar Cambios
          </button>
        </form>
      </div>
    )
  );
}
