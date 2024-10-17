// src/app/components/NavBar.jsx
"use client"; // Make sure this line is present at the top

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav style={{ backgr  oundColor: '#001E58', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
   
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
        <h1 style={{ color: 'white', marginLeft: '10px' }}>DocTIC</h1>
      </div>

  
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
          Inicio
        </Link>
        <Link href="/acerca-de" style={{ color: 'white', textDecoration: 'none' }}>
          Acerca de
        </Link>
        <Link href="/crear-cuenta" style={{ color: 'white', textDecoration: 'none' }}>
          Crear Cuenta
        </Link>
        <Link href="/iniciar-sesion" style={{ color: 'white', textDecoration: 'none' }}>
          Iniciar Sesión
        </Link>
      </div>


      <div>
        {isLoggedIn ? (
          <Image src="/user.png" alt="User" width={40} height={40} /> 
        ) : (
          <Image src="/guest.svg" alt="Guest" width={40} height={40} /> 
        )}
      </div>
    </nav>
  );
};

export default Navbar;
