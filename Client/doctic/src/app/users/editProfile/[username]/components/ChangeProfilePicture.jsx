'use client';
import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function ChangeProfilePicture({username}) {
  ////////////////////////////////////////////////////////////////////////////////////////
  //! OBTENER LOS DATOS DEL USUARIO CAMBIARÁ CUANDO SE HAGA LO DE AUTENTICACIÓN!
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch(
        `http://localhost:8080/api/Usuario/getByUsername/${username}`
      );
      const data = await response.json();
      setUser(data);
    }

    fetchUserData(); // Descomentar cuando CORS esté habilitado
  }, []);

/////////////////////////////////////////////////////////////////////////////////////////////////////////

  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmChange, setConfirmChange] = useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setConfirmChange(true);
  };

  const handleConfirmChange = async (e) => {
    e.preventDefault(); // Asegúrate de prevenir el comportamiento predeterminado

    if (!selectedFile) {
      alert("No se ha seleccionado ningún archivo");
      return;
    }

    // se crea el objeto form data para poder enviar la imagen a la BD
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:8080/api/Usuarios/${username}/updateProfilePicture`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error en la petición a la API");
      }

      const data = await response.json();
      alert("Imagen de perfil actualizada: " + data.message);
    } catch (error) {
      alert("Error al actualizar la imagen de perfil: " + error.message);
    }

    // Limpiar después de la confirmación
    setConfirmChange(false);
    setSelectedFile(null);
    inputRef.current.value = ""; // Restablecer el valor del input
  };

  const handleCancelChange = () => {
    setConfirmChange(false);
    setSelectedFile(null);
    inputRef.current.value = ""; // Restablecer el valor del input
  };

  return (
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 ">
          Cambiar Foto de Perfil de{" "}
          <h3 className="d-inline .h6 text-primary fst-italic">@{username}</h3>
        </h2>
        <div className="form-group mb-4">
          <label htmlFor="profileImage" className="form-label">
            Nueva Foto de Perfil
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            className="form-control"
            onChange={handleFileChange}
            accept=".png"
            ref={inputRef}
          />
          {confirmChange && (
            <div className="alert alert-warning mt-3" role="alert">
              ¿Estás seguro de que quieres cambiar tu foto de perfil?
              <div className="mt-2">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleConfirmChange}
                >
                  Confirmar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelChange}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
