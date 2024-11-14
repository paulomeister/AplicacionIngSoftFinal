"use client";

import { useState, useEffect, useContext } from "react";
import Search from "./components/Search";
import List from "./components/List";
import axios from "axios";
import { AuthContext } from "app/app/context/AuthContext";

export default function PerfilDocuments({ params }) {
  const autorName = decodeURIComponent(params.autorName);
  const { user } = useContext(AuthContext); // Obtiene el usuario autenticado
  const [searchTitle, setSearchTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterIdioma, setFilterIdioma] = useState("");
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });
  const [authorNameFromList, setAuthorNameFromList] = useState("");

  // Verifica si el usuario autenticado es el autor para establecer `propietario`
  const [propietario, setPropietario] = useState(false);

  useEffect(() => {
    if (user && user.username === autorName) {
      setPropietario(true);
    } else {
      setPropietario(false);
    }
  }, [user, autorName]);

  useEffect(() => {
    // Obtiene el nombre completo del autor
    const fetchAuthorName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/Usuarios/getByUsername/${autorName}`);
        const { nombre, apellido } = response.data.perfil;
        setAuthorNameFromList(`${nombre} ${apellido}`);
      } catch (error) {
        console.error("Error al obtener el nombre del autor:", error);
      }
    };

    fetchAuthorName();
  }, [autorName]);

  return (
    <div className="container text-black flex flex-col w-screen">
      {/* Título */}
      <header className=" text-black py-3 mb-8">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-left">
            Documentos publicados por {authorNameFromList}
          </h3>
        </div>
      </header>
  
      {/* Barra de búsqueda */}
      <section className="container mx-auto px-6">
        <Search 
          setSearchTitle={setSearchTitle} 
          setFilterCategory={setFilterCategory} 
          setFilterIdioma={setFilterIdioma} 
          setFilterDates={setFilterDates} 
        />
      </section>
  
      {/* Lista de documentos */}
      <section className="px-6 py-8 flex-grow max-w-screen ">
        <List 
          autorName={autorName} 
          searchTitle={searchTitle} 
          filterCategory={filterCategory} 
          filterIdioma={filterIdioma} 
          filterDates={filterDates} 
          setAuthorNameFromList={setAuthorNameFromList}  
          propietario={propietario}
        />
      </section>
    </div>
  );
}




