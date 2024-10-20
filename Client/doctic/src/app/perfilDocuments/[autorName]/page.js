"use client";

import { useState } from "react";
import Search from "./Search";
import List from './List';

export default function PerfilDocuments({ params }) {
  const autorName = decodeURIComponent(params.autorName);  // Decodifica el nombre del autor desde la URL
  const [searchTitle, setSearchTitle] = useState("");  // Estado para el título de búsqueda
  const [filterCategory, setFilterCategory] = useState([]); // Filtra Categorías como un array
  const [filterIdioma, setFilterIdioma] = useState(""); // Filtra Idiomas como string
  const [filterDates, setFilterDates] = useState({ from: "", to: "" }); // Filtra las fechas (desde, hasta)

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Contenedor para el título */}
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-left mb-8">
          Documentos publicados por {autorName}
        </h1>
      </div>

      {/* Contenedor para la barra de búsqueda */}
      <div className="container mx-auto p-6">
        <Search 
          setSearchTitle={setSearchTitle} 
          setFilterCategory={setFilterCategory} 
          setFilterIdioma={setFilterIdioma} 
          setFilterDates={setFilterDates} 
        />
      </div>

      {/* Contenedor para la lista de documentos */}
      <div className="container mx-auto p-6 flex-grow">
        <List 
          autorName={autorName} 
          searchTitle={searchTitle} 
          filterCategory={filterCategory} 
          filterIdioma={filterIdioma} 
          filterDates={filterDates} 
        />
      </div>
    </div>
  );
}



