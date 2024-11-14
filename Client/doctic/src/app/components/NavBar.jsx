"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
} from "@nextui-org/react";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";

export const NavbarComp = () => {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?titulo=${encodeURIComponent(searchText)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Navbar position="sticky" isBordered maxWidth="2xl" >
      <NavbarBrand>
        <Link href="/home" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </Link>
        <Link className="font-bold text-inherit ml-2" href="/home">
          DocTIC
        </Link>
      </NavbarBrand>

      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem className="mt-3">
          <Link color="foreground" href="/home">
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Input 
            classNames='h-full'
            isClearable
            type="text"
            placeholder="Busca tu documento..."
            className="w-80 mt-3 h-full"
            size="sm"
            variant="bordered"
            radius="full"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            startContent={
              <LuSearch className="cursor-pointer" onClick={handleSearch} />
            } 
          />
        </NavbarItem>
        <NavbarItem>
          <Link className="font-bold mt-3" color="primary" href="/document/new">
            Subir
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {isLoading ? (
          <></>
        ) : isLoggedIn ? (
          <NavbarItem className="lg:flex space-x-5 hover:cursor-pointer">
            <img
              src={user.perfil.fotoPerfil}
              className="shadow-lg rounded-full h-[40px] w-[40px] object-cover"
              alt="Profile"
              onClick={() => (window.location.href = `/users/${user.username}`)}
            />
            <Link color="foreground" href={`/users/${user.username}`}>
              {user.perfil.nombre} {user.perfil.apellido}
            </Link>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="lg:flex">
              <Button
                className="mt-3"
                as={Link}
                color="primary"
                href="/login"
                variant="bordered"
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat" className="mt-3">
                Registrarse
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComp;
