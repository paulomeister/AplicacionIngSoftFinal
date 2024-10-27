'use client';
import React, { useState, useEffect } from "react";
import ResultsList from "./ResultsList";
import Filter from "./Filter";
import conectionDocuments from "../utils/conectionDocuments";
import "./Search.css";

const Search = () => {
  const [mostrarResultados, setMostrarResultados] = useState(false); 
  const [mostrarFiltros, setMostrarFiltros] = useState(false); 

  const [busqueda, setBusqueda] = useState({});
  const [filtros, setFiltros] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const [titulosSugeridos, setTitulosSugeridos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); 

  //-------- Función para actualizar el input de búsqueda y sugerencias ------------
  const handleInputChange = (event) => {
    setTitulo(event.target.value);
  };

// ----------------------------------------------------- SUGERENCIAS ------------------------------------------------------------------------------
  //-------- Funcion para setear títulos sugeridos desde la API ------------
  const handleSetTitulosSugeridos = async () => {
    try {
      if (titulo.trim() === "") {
        setTitulosSugeridos([]); 
        return;
      }
      
      const documentos = await conectionDocuments({ titulo, tieneFiltros: false });
      const titulos = documentos.map(doc => doc.titulo); 
      setTitulosSugeridos(titulos);
      setSelectedIndex(-1); 
    } 
    catch (error) {
      console.error("Error al obtener títulos sugeridos:", error);
    }
  };
  // -----------------------------------------------------------------------

  // -------- Llamado a la función de sugerencia de títulos cada vez que cambia el input ------------
  useEffect(() => {
    if (titulo) {
      handleSetTitulosSugeridos();
    } else {
      setTitulosSugeridos([]); 
    }
  }, [titulo]);

  //-------- Función para seleccionar una sugerencia ------------
  const handleSelectSugerencia = (sugerencia) => {
    setTitulo(sugerencia);
    setTitulosSugeridos([]); 
  };

  // -------- Función para manejar navegación de teclado en sugerencias -----------
  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % titulosSugeridos.length);
    } 
    else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => (prevIndex - 1 + titulosSugeridos.length) % titulosSugeridos.length);
    }
    else if (event.key === "Enter") {
      if (selectedIndex >= 0 && titulosSugeridos[selectedIndex]) {
        handleSelectSugerencia(titulosSugeridos[selectedIndex]);
        setTitulosSugeridos([]);
      } else {
        handleSearchClick();
        setTitulosSugeridos([]);
      }
    }
  };
  //---------------------------------------------------------------------------------------------------------------------------------------------------

  //--------------------------------------------------------------- FILTROS ----------------------------------------------------------------------------
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
    const { categorias, autores, idioma, desde, hasta, keywords } = filtros.reduce((acc, element) => {
      switch (element.tipo) {
        case "CATEGORIA":
          if (element.valor) {
            acc.categorias.push(element.valor);
          }
          break;
        case "KEYWORDS":
          if (element.valor) {
            acc.keywords.push(element.valor);
          }
          break;
        case "AUTOR":
          if (element.valor) {
            acc.autores.push(element.valor);
          }
          break;
        case "IDIOMA":
          if (element.valor) {
            acc.idioma = element.valor;
          }
          break;
        case "DESDE":
          if (element.valor) {
            acc.desde = element.valor;
          }
          break;
        case "HASTA":
          if (element.valor) {
            acc.hasta = element.valor;
          }
          break;
        default:
          break;
      }
      return acc;
    }, { categorias: [], keywords: [], autores: [], idioma: "", desde: "", hasta: "" });

    setBusqueda({ titulo, tieneFiltros: filtros.length > 0, keywords, categorias, autores, idioma, desde, hasta });
  };
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  // --------- Función para mostrar los resultados y cambiar valor del titulo -------------- 
  const handleSearchClick = () => {
    handleMapearFiltros();
    setTitulosSugeridos([]);
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
            <div className="search-icon">
              <input
                type="text"
                placeholder="Buscar"
                className="search-input"
                value={titulo}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} 
              />

              {/* Lista de sugerencias */}
              <div className="sugerencias">
              {titulo && titulosSugeridos.map((titulo, index) => (
                <div
                  key={index}
                  className={`sugerencia-item ${selectedIndex === index ? "selected" : ""}`}
                  onClick={() => handleSelectSugerencia(titulo)} 
                >
                  {titulo}
                </div>
              ))}
              </div>

            </div>

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
        <>
          <ResultsList busqueda={busqueda} sortCriteria={sortCriteria} onSortChange={handleSortChange} />
        </>
      )}
    </div>
  );
};

export default Search;
