"use client";

import { useState } from "react";
import Search from "./components/Search";
import List from "./components/List";

export default function PerfilDocuments({ params }) {
  const autorName = decodeURIComponent(params.autorName);  // Decodifica el nombre del autor desde la URL
  const [searchTitle, setSearchTitle] = useState("");  // Estado para el título de búsqueda
  const [filterCategory, setFilterCategory] = useState([]); // Filtra Categorías como un array
  const [filterIdioma, setFilterIdioma] = useState(""); // Filtra Idiomas como string
  const [filterDates, setFilterDates] = useState({ from: "", to: "" }); // Filtra las fechas (desde, hasta)
  const [authorNameFromList, setAuthorNameFromList] = useState("");  // Nuevo estado para el autor

  return (
    <div className="container min-h-screen  text-black flex flex-col w-full ">
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
      <main className="px-6 py-8 flex-grow max-w-6xl ">
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




