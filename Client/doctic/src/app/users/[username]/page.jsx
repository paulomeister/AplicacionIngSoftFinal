"use client";
import React, { useState, useEffect, useContext } from "react";
import AuthorInfo from "./components/AuthorInfo";
import DocumentList from "./components/DocumentList";
import conectionUser from "../utils/conectionUser";
import "./page.css";
import { AuthContext } from "app/app/context/AuthContext";

function App({ params }) {
  const { user } = useContext(AuthContext);
  const [autor, setAutor] = useState({});
  const [username, setUsername] = useState("");
  const [verTodos, setVerTodos] = useState(false);
  const [esElPropietario, setEsElPropietario] = useState(false);

  // ------- Llamada a la API para obtener la información del autor -----------
  const getAuthorInfo = async () => {
    if (username) {
      const response = await conectionUser(username);
      setAutor(response);
    }
  };

  // ------- cambiar el valor de username desde URL cada vez que cambia el valor de params.username(users/[username]) --------
  useEffect(() => {
    if (params.username) {
      setUsername(params.username);
    }
  }, [params.username]);

  // ------- buscar usuario cuando cambia el valor de username --------
  useEffect(() => {
    getAuthorInfo();
  }, [username]);

  useEffect(() => {
    if (user.username === username) {
      setEsElPropietario(true);
    } else {
      setEsElPropietario(false);
    }
  }, [user]);

  const handleVerTodos = () => {
    setVerTodos(true);
  };

  return (
    <div id="back">
      {!verTodos && (
        <div className="app">
          <AuthorInfo autor={autor} propietario={esElPropietario} />
          <DocumentList
            autor={autor}
            onVerTodos={handleVerTodos}
            propietario={esElPropietario}
          />
        </div>
      )}
    </div>
  );
}

export default App;
