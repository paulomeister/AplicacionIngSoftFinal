import React, { useState, useEffect } from 'react';
import { FaCog, FaEdit } from 'react-icons/fa';
import './AuthorInfo.css';
import Link from 'next/link';

const AuthorInfo = ({ autor, propietario }) => {
  const [avatar, setAvatar] = useState('');

  const obtenerAvatar = () => {
    if (autor && autor.perfil?.fotoPerfil) {
      setAvatar(autor.perfil.fotoPerfil);
    } else {
      setAvatar('https://cdn-icons-png.flaticon.com/512/149/149071.png');
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
        <div className="author-name-container">
          <h2 className="names">
            {`${autor.perfil?.nombre} ${autor.perfil?.apellido}`}
          </h2>
          <h2 className="username">@{autor.username}</h2>
          <h4 className="date">
            Ingresó a <span id="span-doctic">DocTIC</span> en el {autor.fechaRegistro}
          </h4>
        </div>
      </div>

      {propietario &&
        <div className="icons-container">
            <Link className="config-icon" href='/users'><FaCog/><p>Configuraciones</p></Link>
            <Link className="edit-icon" href='/users'><FaEdit/><p>Editar Perfil</p></Link>
        </div>
      }
    </div>
  );
};

export default AuthorInfo;
