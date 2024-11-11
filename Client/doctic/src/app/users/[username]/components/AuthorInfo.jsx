import React, { useState, useEffect, useContext } from "react";
import {
  FaClosedCaptioning,
  FaEdit,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import "./AuthorInfo.css";
import Link from "next/link";
import { AuthContext } from "app/app/context/AuthContext";

const AuthorInfo = ({ autor, propietario }) => {
  const { isLoading, cerrarSesion } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");

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

  return (
    !isLoading && (
      <div className="author-info">
        <div className="author-avatar-container">
          <img src={avatar} alt="Avatar del Autor" className="author-avatar" />
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

                <Link
                  className="flex items-center space-x-2 text-red-700 hover:text-red-900"
                  href="/users"
                >
                  <FaTrash />
                  <span>Eliminar Cuenta</span>
                </Link>
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
      </div>
    )
  );
};

export default AuthorInfo;
