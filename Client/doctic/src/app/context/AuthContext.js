"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  function notificacionDeExito(message) {
    return toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }

  function notificacionDeError(message) {
    return toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }

  async function obtenerUsuarioConKey(username, storedClientKey) {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/Usuarios/getByUsername/${username}`
      );

      if (res.data) {
        setUser(res.data);
        setIsLoggedIn(true);
        setClientKey(storedClientKey);
        setIsLoading(false);
      } else {
        console.log("Usuario no encontrado");
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener usuario por username:", error);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }

  async function obtenerAutorizacion(username, password) {
    try {
      const res = await axios.post(
        "http://localhost:8080/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 401) {
        notificacionDeError("Credenciales erróneas");
        return;
      }

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
        window.location.href = "/home"; // esto es como un navigate("/home")

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {

      if (error.status === 401) notificacionDeError("Verifica tus credenciales")
      else notificacionDeError(error.message)
      
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }

  function cerrarSesion() {
    localStorage.setItem("clientKey", "");
    setClientKey("");
    setUser({});
    setIsLoggedIn(false);
    window.location.href = "/login"; // esto es como un navigate("/login")
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        clientKey,
        obtenerAutorizacion,
        cerrarSesion,
        notificacionDeExito,
        notificacionDeError,
      }}
    >
      {children}

      {/* Contenedor de Toast para notificaciones */}
      <ToastContainer
        position="top-center"
        autoClose={3000} // Configuración ajustada para el cierre automático
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthContext.Provider>
  );
};
