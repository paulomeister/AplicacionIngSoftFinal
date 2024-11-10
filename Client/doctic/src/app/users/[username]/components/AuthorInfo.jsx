import React, { useState, useEffect, useContext } from "react";
import { FaClosedCaptioning, FaCog, FaEdit, FaTrash } from "react-icons/fa";
import "./AuthorInfo.css";
import Link from "next/link";
import { AuthContext } from "app/app/context/AuthContext";
import { Button } from "react-bootstrap";

const AuthorInfo = ({ autor, propietario }) => {
  const { cerrarSesion } = useContext(AuthContext);

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
    <div className="author-info">
      <div className="author-avatar-container">
        <img src={avatar} alt="Avatar del Autor" className="author-avatar" />
        <div className="author-info-container">
          {propietario && (
            <div className="buttons-container">
              <div className="icons-container ">
                <button class="btn btn-dangerr" onClick={cerrarSesion}>
                  <FaClosedCaptioning className="p-0 m-0" />
                  Cerrar Sesión
                </button>
              </div>
              <div className="icons-container">
                <Link
                  className="edit-icon"
                  href={`/users/editProfile/${autor.username}`}
                >
                  <FaEdit />
                  <p>Editar Perfil</p>
                </Link>
                <Link className="config-icon" href="/users">
                  <FaTrash />
                  <p>Eliminar Cuenta</p>
                </Link>
              </div>
            </div>
          )}
          <div className="author-name-container">
            <h2 className="names">
              {`${autor.perfil?.nombre} ${autor.perfil?.apellido}`}
            </h2>
            <h2 className="username">@{autor.username}</h2>
            <h4 className="date">
              Ingresó a <span id="span-doctic">DocTIC</span> en el{" "}
              {autor.fechaRegistro}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
