"use client";

// import Link from 'next/link';
import Image from "next/image";
import { useContext, useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";

export const NavbarComp = () => {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Navbar position="sticky" isBordered maxWidth="2xl">
      <NavbarBrand>
        <Link href="/home">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </Link>
        <Link className="font-bold  text-inherit" href="/home">
          DocTIC
        </Link>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/home">
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/search">
            Buscar
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className=" font-bold " color="primary" href="/document/new">
            Subir
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {isLoading ? (
          <></>
        ) : isLoggedIn ? (
          <NavbarItem className="lg:flex space-x-5 mt-2">
            <img
              src={user.perfil.fotoPerfil}
              className="shadow-lg rounded-full h-[40px] w-[40px]"
            />
            <Link

              color="foreground"
              href={`/users/${user.username}`}
            >
              {user.perfil.nombre} {user.perfil.apellido}
            </Link>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="lg:flex">
              <Button
                as={Link}
                color="primary"
                href="/login"
                variant="bordered"
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Registrarse
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );

  return (
    <nav
      style={{
        backgroundColor: "#001E58",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <h1 style={{ color: "white", marginLeft: "10px" }}>DocTIC</h1>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>
          Inicio
        </Link>
        <Link href="/search" style={{ color: "white", textDecoration: "none" }}>
          Buscar
        </Link>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
        }}
      >
        <Image
          src={isLoggedIn ? "/user.png" : "/guest.svg"}
          alt={isLoggedIn ? "User" : "Guest"}
          width={40}
          height={40}
          onClick={toggleMenu}
          style={{ cursor: "pointer" }}
        />

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "0",
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {!isLoggedIn && (
              <>
                <Link
                  href="/crear-cuenta"
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    color: "#001E58",
                    textDecoration: "none",
                  }}
                >
                  Crear Cuenta
                </Link>
                <Link
                  href="/iniciar-sesion"
                  style={{
                    display: "block",
                    color: "#001E58",
                    textDecoration: "none",
                  }}
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Link
                href="/perfil"
                style={{
                  display: "block",
                  color: "#001E58",
                  textDecoration: "none",
                }}
              >
                Ver Perfil
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarComp;
