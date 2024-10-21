'use client';
import React, { useState } from 'react';
import './AuthorInfo.css';
import conectionUser from '../utils/conectionUser';

const AuthorInfo = () => {
  const [autor, setAutor] = useState({});

  const getAuthorInfo = async () => {
    const response = await conectionUser();
    setAutor(response);
  }

  getAuthorInfo();

  return (
    <div className="author-info">
      <div className="author-avatar-container">
        <img src={autor.perfil?.fotoPerfil} alt="Avatar del Autor" className="author-avatar" />
        <h2 className="author-name">{autor.username}</h2>
      </div>
      <div className="info-box">
        <p>Nombre: {autor.perfil?.nombre}</p>
        <p>Apellido: {autor.perfil?.apellido}</p>
        <p>email: {autor.email}</p>
        <p>Fecha de registro: {autor.fechaRegistro}</p>
      </div>
    </div>
  );
};


export default AuthorInfo;
