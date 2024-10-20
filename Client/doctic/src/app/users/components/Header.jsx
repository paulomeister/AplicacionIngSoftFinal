'use client';
import React from 'react';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/img/logoDocTip.jpeg" />
      </div>
      <div className="user">
        <span className='usertxt'>Usuario</span>
        <img src="/img/prueba.png" />
      </div>
    </header>
  );
};

export default Header;
