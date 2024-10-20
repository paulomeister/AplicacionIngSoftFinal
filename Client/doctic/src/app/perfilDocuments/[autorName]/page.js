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
  const [authorNameFromList, setAuthorNameFromList] = useState("");  // Nuevo estado para el autor

  return (
    <div className="min-h-screen  text-black flex flex-col">
      {/* Contenedor para el título */}
      <header className=" text-black py-6 mb-8">
        <div className="container mx-auto px-6">
          <h3 className="text-5xl font-bold text-center">
            Documentos publicados por {authorNameFromList || autorName}
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
      <main className="container mx-auto px-6 py-8 flex-grow">
        <List 
          autorName={autorName} 
          searchTitle={searchTitle} 
          filterCategory={filterCategory} 
          filterIdioma={filterIdioma} 
          filterDates={filterDates} 
          setAuthorNameFromList={setAuthorNameFromList}  
        />
      </main>
  
      
    </div>
  );
}




