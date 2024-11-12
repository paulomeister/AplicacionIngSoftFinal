"use client";
import React, { useState, useEffect, useContext } from "react";
import { ChangeEmail } from "./components/ChangeEmail";
import { ChangeUsername } from "./components/ChangeUsername";
import { EditProfile } from "./components/ChangeProfile";
import { ChangePassword } from "./components/ChangePassword";
import { ChangeProfilePicture } from "./components/ChangeProfilePicture";
import "./page.css";
import { AuthContext } from "app/app/context/AuthContext";
import { SpinerComp } from "app/app/document/[id]/components/SpinnerComp";

function App({ params }) {
  const {
    user,
    isLoading,
    isLoggedIn,
    notificacionDeError,
    notificacionDeExito,
  } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [selectedOption, setSelectedOption] = useState("editProfile"); // Estado para la opción seleccionada

  // Cambiar el valor de username desde URL cada vez que cambia el valor de params.username(users/[username])
  useEffect(() => {
    if (params.username) {
      setUsername(params.username);
    }
  }, [params.username]);

  useEffect(() => {
    if (!isLoading) {
      if (user?.username !== params.username) {
        window.location.href = "/error404";
      }
    }
  }, [isLoading]);

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "editProfile":
        return <EditProfile username={username} />;
      case "changeEmail":
        return <ChangeEmail username={username} />;
      case "changePassword":
        return <ChangePassword username={username} />;
      case "changeUsername":
        return <ChangeUsername username={username} />;
      case "changeProfilePicture":
        return <ChangeProfilePicture username={username} />;
      default:
        return null;
    }
  };

  return isLoading ? (
    <SpinerComp />
  ) : (
    <div className="appEditProfile">
      <h1 className="m-5 text-6xl text-center ">
        ¿Qué <span className="text-blue-400">Gran</span> Cambio quieres hacer
        hoy {user.nombre}?
      </h1>
      <div className="edit-options-container">
        <label
          htmlFor="editOptionSelect"
          className="form-label font-bold text-xl"
        >
          Selecciona una opción de edición:
        </label>
        <select
          id="editOptionSelect"
          className="form-select mb-3 drop-shadow-2xl"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="editProfile">Editar Perfil</option>
          <option value="changeEmail">Cambiar Correo</option>
          <option value="changePassword">Cambiar Contraseña</option>
          <option value="changeUsername">Cambiar Nombre de Usuario</option>
          <option value="changeProfilePicture">Cambiar Foto de Perfil</option>
        </select>
      </div>
      <div className="edit-container">{renderSelectedComponent()}</div>
    </div>
  );
}

export default App;
