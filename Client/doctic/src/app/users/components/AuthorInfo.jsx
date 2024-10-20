'use client';
import React, { useState, useEffect } from 'react';
import './AuthorInfo.css';
import conection from './conection';

const AuthorInfo = () => {
  const [autor, setAutor] = useState({});

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      try {
        const response = await conection();
        setAutor(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAuthorInfo();
  }, []);

  return (
    <div className="author-info">
      <div className="author-avatar-container">
        <img src={autor.perfil?.fotoPerfil} alt="Avatar del Autor" className="author-avatar" />
        <h2 className="author-name">{autor.username}</h2>
      </div>
      <div className="info-box">
        <p>Nombre: {autor.perfil?.nombre}</p>
        <p>Apellido: {autor.perfil?.apellido}</p>
        <p>Fecha de registro: {autor.fechaRegistro}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
