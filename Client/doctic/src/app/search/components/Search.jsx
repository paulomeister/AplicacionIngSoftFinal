'use client';
import React, { useState } from "react";
import "./Search.css";
import {ResultsList} from "./ResultsList";
import {SortMenu} from "./SortMenu";
import {Filter} from "./Filter";

export const Search = () => {
  let filtros = [];
  let tieneFiltros = false;

  let titulo = "";
  let categorias = [];
  let autores = [];
  let idioma = "";
  let desde = "";
  let hasta = "";

  const [mostrarResultados, setMostrarResultados] = useState(false); 
  const [mostrarFiltros, setMostrarFiltros] = useState(false); 

  const [busqueda, setBusqueda] = useState({});

  //-------- Funcion para cambiar el valor de input ------------
  const handleInputChange = (event) => {
    titulo = (event.target.value);
  };

  //-------- Funcion para mostrar los filtros ------------
  const handleToggleFiltros = () => {
    setMostrarFiltros((prevState) => !prevState);
  };

  //-------- Función para actualizar inputFiltros desde Filter ------------
  const updateFilters = (newFilters) => {
    filtros = (newFilters);
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
  }

  //-------- Función para mapear los filtros ------------
  const handleMapearFiltros = () => {
    let newCategorias = [];
    let newAutores = []; 
    let newIdioma = "";
    let newDesde = "";
    let newHasta = "";
  
    for (let i = 0; i < filtros.length; i++) {
      switch (filtros[i].tipo) {
        case "CATEGORIA":
          newCategorias.push(filtros[i].valor);
          break;
        case "AUTOR":
          newAutores.push(filtros[i].valor);
          break;
        case "IDIOMA":
          newIdioma = filtros[i].valor;
          break;
        case "DESDE":
          newDesde = filtros[i].valor;
          break;
        case "HASTA":
          newHasta = filtros[i].valor;
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
  }

  //-------- Funcion para mostrar los resultados y cambiar valor del titulo --------------
  const handleSearchClick = () => {
    tieneFiltros = filtros.length > 0;
    handleMapearFiltros();
    updateBusqueda();

    setMostrarResultados(true); 
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

        {/* Mostrar/Ocultar sección de filtros */}
        {mostrarFiltros && (
          <Filter onUpdateFilters={updateFilters} /> //---> Pasar la función de actualización de filtros
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
          <ResultsList busqueda={busqueda} />
          <SortMenu />
        </div>
      )}      
    </>
  );
};
