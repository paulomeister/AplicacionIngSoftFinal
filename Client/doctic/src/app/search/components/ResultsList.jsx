'use client';
import React, { useState, useEffect } from "react";
import ResultItem from "./ResultItem";
import conection from "../utils/conectionDocuments";
import { AlertPop } from '../utils/AlertPopup';
import SortMenu from './SortMenu';
import "./ResultList.css";
import conectionDocuments from "../utils/conectionDocuments";

const ResultsList = ({ busqueda, sortCriteria, onSortChange }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 10;

  // --------------------------------------- Hacer la petición a la API --------------------------------------------
  const getResults = async () => {
    setLoading(true);
    try {
      const response = await conectionDocuments(busqueda);
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

  // ----------------------- Ordenar los resultados filtrados según el criterio de orden -------------------------
  const applySort = (results) => {
    return [...results].sort((a, b) => {
      const calcularPromedioValoracion = (valoraciones) => {
        if (valoraciones?.length === 0) {

          return 0;

        } else {
          const suma = valoraciones?.reduce((total, valoracion) => total + valoracion.puntuacion, 0);
          return suma / valoraciones?.length;
        }
      };

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

  const getFilteredAndSortedResults = () => {
    return applySort(results);
  };

  const finalResults = getFilteredAndSortedResults();

  // ------- Lógica de paginación -------
  const totalPages = Math.ceil(finalResults.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = finalResults.slice(indexOfFirstResult, indexOfLastResult);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

    // ------- Manejo de estado de carga y errores -------
    if (loading || error || finalResults.length === 0) {
      return (
        <div className="results-error">
          <AlertPop error={error} loading={loading} finalResults={finalResults} />
        </div>
      )
    }
    
  // ------- Renderizar resultados -------
  return (
    <div className="results-container">
      <div className="results-list">
        <div className="results-items">
          <ResultItem results={currentResults} />
        </div>
        <div className="sort-container">
          <SortMenu onSortChange={onSortChange} />
        </div>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
            {index + 1}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ResultsList;
