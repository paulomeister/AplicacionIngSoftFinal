"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientKey, setClientKey] = useState(null);

  useEffect(() => {
    const storedClientKey = localStorage.getItem("clientKey");

    if (storedClientKey) {
      try {
        const decoded = jwtDecode(storedClientKey); // Decodifica el token
        const username = decoded.sub; // Extrae el nombre de usuario desde el "sub"

        // Llamar a la API para obtener el usuario
        obtenerUsuarioConKey(username, storedClientKey);
      } catch (error) {
        console.error("Error al decodificar la clientKey", error);
        setIsLoggedIn(false);
      }
    }
  }, []);

  async function obtenerUsuarioConKey(username, storedClientKey) {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/Usuarios/getByUsername/${username}`
      );

      if (res.data) {
        setUser(res.data);
        setIsLoggedIn(true);
        setClientKey(storedClientKey);
      } else {
        console.log("Usuario no encontrado");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error al obtener usuario por username:", error);
      setIsLoggedIn(false);
    }
  }

  async function obtenerAutorizacion(username, password) {
    try {
      const res = await axios.post(
        "http://localhost:8080/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const clientKey = res.headers["authorization"];

      if (clientKey) {
        const decoded = jwtDecode(clientKey); // Decodifica el clientKey
        const usernameFromToken = decoded.sub;

        const getUser = await axios.get(
          `http://localhost:8080/api/Usuarios/getByUsername/${usernameFromToken}`
        );

        setUser(getUser.data);
        setIsLoggedIn(true);
        setClientKey(clientKey);
        localStorage.setItem("clientKey", clientKey);

        console.log("HOLA");
        window.location.href = "/home";
      } else {
        alert("USUARIO NO ENCONTRADO"); // !TODO
      }
    } catch (error) {
      console.error("Error de Axios:", error);
      setIsLoggedIn(false);
    }
  }

  function cerrarSesion() {
    localStorage.setItem("clientKey", "");
    setClientKey("");
    setUser({});
    setIsLoggedIn(false);
    window.location.href = "/login";
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        clientKey,
        obtenerAutorizacion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
