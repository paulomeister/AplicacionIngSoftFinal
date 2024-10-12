import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <nav style={{ backgroundColor: '#001E58', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
        <h1 style={{ color: 'white', marginLeft: '10px' }}>dDocTIC</h1>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/">
          <a style={{ color: 'white', textDecoration: 'none' }}>Inicio</a>
        </Link>
        <Link href="/acerca-de">
          <a style={{ color: 'white', textDecoration: 'none' }}>Acerca de</a>
        </Link>
        <Link href="/crear-cuenta">
          <a style={{ color: 'white', textDecoration: 'none' }}>Crear Cuenta</a>
        </Link>
        <Link href="/iniciar-sesion">
          <a style={{ color: 'white', textDecoration: 'none' }}>Iniciar Sesión</a>
        </Link>
      </div>

      {/* Icono (posiblemente para perfil o sesión) */}
      <div>
        {isLoggedIn ? (
          <Image src="/user-icon.png" alt="User" width={40} height={40} />
        ) : (
          <Image src="/guest-icon.png" alt="Guest" width={40} height={40} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
