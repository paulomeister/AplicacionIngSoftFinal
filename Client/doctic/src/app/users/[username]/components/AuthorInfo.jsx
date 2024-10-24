import React from 'react';
import './AuthorInfo.css';

const AuthorInfo = ({ autor }) => {
  return (
    <div className="author-info">
      <div className="author-avatar-container">
        <img src={autor.perfil?.fotoPerfil} alt="Avatar del Autor" className="author-avatar" />
        <div className="author-name-container">
          <h2 className="author-name">{autor.username}</h2>
        </div>
      </div>
      <div className="info-box">
        <p className="author-description"><strong>Nombre:</strong> {autor.perfil?.nombre}</p>
        <p className="author-description"><strong>Apellido:</strong> {autor.perfil?.apellido}</p>
        <p className="author-description"><strong>E-mail:</strong> {autor.email}</p>
        <p className="author-description"><strong>Fecha de registro:</strong> {autor.fechaRegistro}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
