'use client';
import React, { useState } from "react";
import "./Search.css";
import ResultsList from "./ResultsList";
import SortMenu from "./SortMenu";
import Filter from "./Filter";

const Search = () => {
  const [mostrarResultados, setMostrarResultados] = useState(false); 
  const [mostrarFiltros, setMostrarFiltros] = useState(false); 

  const [busqueda, setBusqueda] = useState({});

  const [filtros, setFiltros] = useState([]);

  const [titulo, setTitulo] = useState("");
  let tieneFiltros = false;
  let categorias = [];
  let autores = [];
  let idioma = "";
  let desde = "";
  let hasta = "";

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
    let newCategorias = [];
    let newAutores = []; 
    let newIdioma = "";
    let newDesde = "";
    let newHasta = "";
  
    for (const element of filtros) {
      switch (element.tipo) {
        case "CATEGORIA":
          newCategorias.push(element.valor);
          break;
        case "AUTOR":
          newAutores.push(element.valor);
          break;
        case "IDIOMA":
          newIdioma = element.valor;
          break;
        case "DESDE":
          newDesde = element.valor;
          break;
        case "HASTA":
          newHasta = element.valor;
          break;
        default:
          break;
      }

      categorias = (newCategorias);
      autores = (newAutores);
      idioma = (newIdioma);
      desde = (newDesde);
      hasta = (newHasta);
    }
  };

  // --------- Función para actualizar valor de busqueda --------------- 
  const updateBusqueda = () => {
    setBusqueda({
      titulo: titulo,
      tieneFiltros: tieneFiltros,
      categorias: categorias,
      autores: autores,
      idioma: idioma,
      desde: desde,
      hasta: hasta
    });  
  };


  //-------- Función para mostrar los resultados y cambiar valor del titulo -------------- 
  const handleSearchClick = () => {
    handleMapearFiltros();
    updateBusqueda();

    setMostrarResultados(true); 
  };

  // ------------ Función para actualizar el criterio de ordenamiento -------------
  const handleSortChange = (newSortCriteria) => {
    setSortCriteria(newSortCriteria);
  };

  return (
    <>
      <div className="filter-container">
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
          <Filter onUpdateFilters={updateFilters} filtros = {filtros} />
        )}
      </div>

      <div className="colapse-container">
        <button className="colapse-btn" onClick={handleToggleFiltros}>
          {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {/*------ Mostrar resultados después de buscar ------*/}
      {mostrarResultados && (
        <div className="divider">
          <ResultsList busqueda={busqueda} sortCriteria={sortCriteria} /> {/* Pasa el criterio de orden */}
          <SortMenu onSortChange={handleSortChange} /> {/* Pasa la función de ordenamiento */}
        </div>
      )}
    </>
  );
};

export default Search;
