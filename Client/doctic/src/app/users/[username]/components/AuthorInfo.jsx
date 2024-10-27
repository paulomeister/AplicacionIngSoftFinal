import React from 'react';
import './AuthorInfo.css';

const AuthorInfo = ({ autor }) => {
  return (
    <div className="author-info">
      <div className="author-avatar-container">
        <img src={autor.perfil?.fotoPerfil} alt="Avatar del Autor" className="author-avatar" />
        <div className="author-name-container">
          <h2 className="names"> {`${autor.perfil?.nombre}  ${autor.perfil?.apellido}`}</h2>
          <h2 className="username">@{autor.username}</h2>
          <h4 className='date'>Ingresó a <span id="span-doctic">DocTIC</span> en el {autor.fechaRegistro}</h4>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
