'use client';
import React, { useState, useEffect } from "react";
import ResultItem from "./ResultItem";
import conection from "./conection";
import {AlertPop} from './AlertPopup';
import SortMenu from './SortMenu';
import "./ResultList.css";

const ResultsList = ({ busqueda, sortCriteria, onSortChange }) => {
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  //--------------------------------------- Hacer la petición a la API -------------------------------------------- 
  const getResults = async () => {
    setLoading(true);
    try {
      const response = await conection(busqueda);
      setResults(response); 
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  // ------- Llamada a la API -------
  useEffect(() => {
    if (busqueda) {
      getResults();
    }
  }, [busqueda]);

  // ------- Filtrar los resultados según los filtros en 'busqueda' -------
  const applyFilters = (results) => {
    return results.filter((result) => {
      const matchCategoria = busqueda.categorias.length === 0 || busqueda.categorias.some(cat => result.categoria.some(rc => rc.nombre === cat));
      const matchAutor = busqueda.autores.length === 0 || busqueda.autores.some(autor => result.autores.some(ra => ra.nombre === autor));
      const matchIdioma = !busqueda.idioma || result.idioma === busqueda.idioma;
      const matchDesde = !busqueda.desde || new Date(result.fechaSubida) >= new Date(busqueda.desde);
      const matchHasta = !busqueda.hasta || new Date(result.fechaSubida) <= new Date(busqueda.hasta);

      return matchCategoria && matchAutor && matchIdioma && matchDesde && matchHasta;
    });
  };

  // ----------------------- Ordenar los resultados filtrados según el criterio de orden -------------------------
  const applySort = (results) => {

    return [...results].sort((a, b) => {

      // ---- Función para calcular el promedio de valoraciones de un documento -----
      const calcularPromedioValoracion = (valoraciones) => {
        
        if (valoraciones.length === 0) return 2.5; 

        const suma = valoraciones.reduce((total, valoracion) => total + valoracion.puntuacion, 0); 
        return suma / valoraciones.length;
      };
  
      // ---- Ordenar de acuerdo al criterio de ordenación seleccionado ----
      switch (sortCriteria) {
        case "alfabetico":
          return a.titulo.localeCompare(b.titulo);
        case "alfabetico-inverso":
          return b.titulo.localeCompare(a.titulo);
        case "fecha-asc":
          return new Date(a.fechaSubida) - new Date(b.fechaSubida);
        case "fecha-desc":
          return new Date(b.fechaSubida) - new Date(a.fechaSubida);
        case "valoracion-asc":
          return calcularPromedioValoracion(a.valoraciones) - calcularPromedioValoracion(b.valoraciones);
        case "valoracion-desc":
          return calcularPromedioValoracion(b.valoraciones) - calcularPromedioValoracion(a.valoraciones);
        default:
          return 0;
      }
    });
  };
  //------------------------------------------------------------------------------------------------------------------
  
  // ------- Aplicar Filtros y Ordenamiento en los resultados -------
  const getFilteredAndSortedResults = () => {
    let filteredResults = applyFilters(results); 
    return applySort(filteredResults); 
  };

  const finalResults = getFilteredAndSortedResults();

  // ------- Manejo de estado de carga y errores -------
  if ((loading)||(error)||(finalResults.length === 0)) {
    return (
      <div className="results-error">
        <AlertPop error={error} loading={loading} finalResults={finalResults}/>
      </div>
    )
  }

  // ------- Renderizar resultados -------
  return (
    <div className="results-list">
      <ResultItem results={finalResults} />
      <SortMenu onSortChange={onSortChange}/>
    </div>
  );
};

export default ResultsList;
