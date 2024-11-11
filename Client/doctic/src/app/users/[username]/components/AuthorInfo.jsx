import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaEdit, FaSignOutAlt, FaTrash } from "react-icons/fa";
import "./AuthorInfo.css";
import Link from "next/link";
import { AuthContext } from "app/app/context/AuthContext";

const AuthorInfo = ({ autor, propietario }) => {
  const {
    notificacionDeExito,
    notificacionDeError,
    user,
    isLoading,
    clientKey,
    cerrarSesion,
  } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");
  const [confirmUsername, setConfirmUsername] = useState(""); // Estado para el nombre de usuario de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Estado para mostrar el prompt de confirmación

  const obtenerAvatar = () => {
    if (autor && autor.perfil?.fotoPerfil) {
      setAvatar(autor.perfil.fotoPerfil);
    } else {
      setAvatar("/usuario_anonimo.png");
    }
  };

  useEffect(() => {
    if (autor && Object.keys(autor).length !== 0) {
      obtenerAvatar();
    }
  }, [autor]);

  const handleDeleteAccount = async () => {
    if (confirmUsername === user.username) {
      // Verifica que el nombre de usuario ingresado coincida
      try {
        await axios.delete(
          `http://localhost:8080/api/Usuarios/deleteUser/${user.username}`,
          {},
          {
            headers: {
              Authorization: clientKey,
            },
          }
        );
        cerrarSesion(); // Cierra sesión después de eliminar la cuenta
        notificacionDeExito("Cuenta eliminada con éxito.");

        setTimeout(() => {
          window.location.href = "/home";
        }, 5000);
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        notificacionDeError("Hubo un error al intentar eliminar la cuenta.");
      }
    } else {
      notificacionDeError("El nombre de usuario ingresado no coincide.");
    }
  };

  return (
    !isLoading && (
      <div className="author-info">
        <div className="author-avatar-container">
          <img
            src={avatar}
            alt="Avatar del Autor"
            className=" object-contain h-[150px] w-[150px] rounded-full "
          />
          <div className="author-info-container">
            {propietario && (
              <div className="flex justify-center items-center gap-4 w-[600px] p-4">
                <button
                  className="btn btn-danger flex items-center space-x-2 w-[150px]"
                  onClick={cerrarSesion}
                >
                  <span className="text-sm">
                    <FaSignOutAlt />
                    Cerrar Sesión
                  </span>
                </button>

                <Link
                  className=" flex items-center space-x-2 text-blue-700 hover:text-blue-900"
                  href={`/users/editProfile/${autor.username}`}
                >
                  <FaEdit />
                  <span>Editar Perfil</span>
                </Link>

                <button
                  className="flex items-center space-x-2 text-red-700 hover:text-red-900"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <FaTrash />
                  <span>Eliminar Cuenta</span>
                </button>
              </div>
            )}
            <div className="author-name-container hover:cursor-default">
              <h2 className="names">
                {`${autor.perfil?.nombre} ${autor.perfil?.apellido}`}
              </h2>
              <h2 className="username">@{autor.username}</h2>
              <h4 className="date hover:cursor-default">
                Ingresó a{" "}
                <span id="span-doctic" className="hover:cursor-default">
                  DocTIC
                </span>{" "}
                en el {autor.fechaRegistro}
              </h4>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirmation">
            <h3>Confirma la eliminación de tu cuenta</h3>
            <p>Por favor, escribe tu nombre de usuario para confirmar:</p>
            <input
              type="text"
              value={confirmUsername}
              onChange={(e) => setConfirmUsername(e.target.value)}
              placeholder="Nombre de usuario"
              className="username-input"
            />
            <button onClick={handleDeleteAccount} className="btn btn-danger">
              Confirmar eliminación
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default AuthorInfo;
