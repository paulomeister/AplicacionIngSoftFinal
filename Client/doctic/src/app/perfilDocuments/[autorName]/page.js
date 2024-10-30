"use client";

import { useState, useEffect } from "react";
import Search from "./components/Search";
import List from "./components/List";
import axios from "axios";

export default function PerfilDocuments({ params }) {
  const autorName = decodeURIComponent(params.autorName);  // Decodifica el nombre del autor desde la URL
  const [searchTitle, setSearchTitle] = useState("");  // Estado para el título de búsqueda
  const [filterCategory, setFilterCategory] = useState([]); // Filtra Categorías como un array
  const [filterIdioma, setFilterIdioma] = useState(""); // Filtra Idiomas como string
  const [filterDates, setFilterDates] = useState({ from: "", to: "" }); // Filtra las fechas (desde, hasta)
  const [authorNameFromList, setAuthorNameFromList] = useState("");  // Estado para el nombre completo del autor

  useEffect(() => {
    // Función para obtener el nombre completo del autor
    const fetchAuthorName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/Usuarios/getByUsername/${autorName}`);
        const { nombre, apellido } = response.data.perfil;  // Extraemos el nombre y apellido del perfil
        setAuthorNameFromList(`${nombre} ${apellido}`);  // Combinamos nombre y apellido
      } catch (error) {
        console.error("Error al obtener el nombre del autor:", error);
      }
    };

    fetchAuthorName();
  }, [autorName]);

  return (
    <div className="container text-black flex flex-col w-screen">
      {/* Contenedor para el título */}
      <header className=" text-black py-3 mb-8">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-left">
            Documentos publicados por {authorNameFromList}
          </h3>
        </div>
      </header>
  
      {/* Contenedor para la barra de búsqueda */}
      <section className="container mx-auto px-6">
        <Search 
          setSearchTitle={setSearchTitle} 
          setFilterCategory={setFilterCategory} 
          setFilterIdioma={setFilterIdioma} 
          setFilterDates={setFilterDates} 
        />
      </section>
  
      {/* Contenedor para la lista de documentos */}
      <section className="px-6 py-8 flex-grow max-w-screen ">
        <List 
          autorName={autorName} 
          searchTitle={searchTitle} 
          filterCategory={filterCategory} 
          filterIdioma={filterIdioma} 
          filterDates={filterDates} 
          setAuthorNameFromList={setAuthorNameFromList}  
        />
      </section>
    </div>
  );
}




