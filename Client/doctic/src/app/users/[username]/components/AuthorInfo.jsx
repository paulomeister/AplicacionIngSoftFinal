import React from 'react';
import './AuthorInfo.css';

const AuthorInfo = ({ autor }) => {
  return (
    <div className="author-info">
      <div className="author-avatar-container">
        <img src={autor.perfil?.fotoPerfil} alt="Avatar del Autor" className="author-avatar" />
        <h2 className="author-name">{autor.username}</h2>
      </div>
      <div className="info-box">
        <p className="author-description">Nombre: {autor.perfil?.nombre}</p>
        <p className="author-description">Apellido: {autor.perfil?.apellido}</p>
        <p className="author-description">Email: {autor.email}</p>
        <p className="author-description">Fecha de registro: {autor.fechaRegistro}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
