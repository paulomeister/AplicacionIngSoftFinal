"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav style={{ backgroundColor: '#001E58', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
   
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
      </div>

      <div style={{ position: 'relative' }}>
        <Image 
          src={isLoggedIn ? "/user.png" : "/guest.svg"} 
          alt={isLoggedIn ? "User" : "Guest"} 
          width={40} 
          height={40} 
          onClick={toggleMenu} 
          style={{ cursor: 'pointer' }} 
        />

        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            backgroundColor: '#fff',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {!isLoggedIn && (
              <>
                <Link href="/crear-cuenta" style={{ display: 'block', marginBottom: '10px', color: '#001E58', textDecoration: 'none' }}>
                  Crear Cuenta
                </Link>
                <Link href="/iniciar-sesion" style={{ display: 'block', color: '#001E58', textDecoration: 'none' }}>
                  Iniciar Sesión
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Link href="/perfil" style={{ display: 'block', color: '#001E58', textDecoration: 'none' }}>
                Ver Perfil
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
