'use client';
import React, { useState } from "react";
import ResultsList from "./ResultsList";
import Filter from "./Filter";
import "./Search.css";

const Search = () => {
  const [mostrarResultados, setMostrarResultados] = useState(false); 
  const [mostrarFiltros, setMostrarFiltros] = useState(false); 

  const [busqueda, setBusqueda] = useState({});
  const [filtros, setFiltros] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");  

  //-------- Funcion para cambiar el valor de input ------------ 
  const handleInputChange = (event) => {
    setTitulo(event.target.value);
  };

  //-------- Función para mostrar los filtros ------------ 
  const handleToggleFiltros = () => {
    setMostrarFiltros((prevState) => !prevState);
  };

  //-------- Función para actualizar inputFiltros desde Filter ------------ 
  const updateFilters = (newFilters) => {
    setFiltros(newFilters);
  };

  //-------- Función para mapear los filtros ------------ 
  const handleMapearFiltros = () => {
    const { categorias, autores, idioma, desde, hasta } = filtros.reduce((acc, element) => {
      switch (element.tipo) {
        case "CATEGORIA":
          acc.categorias.push(element.valor);
          break;
        case "AUTOR":
          acc.autores.push(element.valor);
          break;
        case "IDIOMA":
          acc.idioma = element.valor;
          break;
        case "DESDE":
          acc.desde = element.valor;
          break;
        case "HASTA":
          acc.hasta = element.valor;
          break;
        default:
          break;
      }
      return acc;
    }, { categorias: [], autores: [], idioma: "", desde: "", hasta: "" });

    // Update the busqueda state
    setBusqueda({ titulo, tieneFiltros: filtros.length > 0, categorias, autores, idioma, desde, hasta });
  };

  // --------- Función para mostrar los resultados y cambiar valor del titulo -------------- 
  const handleSearchClick = () => {
    handleMapearFiltros();
    setMostrarResultados(true); 
  };

  // ------------ Función para actualizar el criterio de ordenamiento ------------- 
  const handleSortChange = (newSortCriteria) => {
    setSortCriteria(newSortCriteria);
  };

  return (
    <div className="search-container">
      <div className="filter-container">
        <div className="filter-title">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar"
              className="search-input"
              onChange={handleInputChange}
            />
            <button className="search-btn" onClick={handleSearchClick}>
              Buscar
            </button>
          </div>
          <hr />

          {mostrarFiltros && (
            <Filter onUpdateFilters={updateFilters} filtros={filtros} />
          )}
        </div>
        <button className="colapse-btn" onClick={handleToggleFiltros}>
          {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {/*------ Mostrar resultados después de buscar ------*/}
      {mostrarResultados && (
        <div className="divider">
          <ResultsList busqueda={busqueda} sortCriteria={sortCriteria} onSortChange={handleSortChange} />
        </div>
      )}
    </div>
  );
};

export default Search;
