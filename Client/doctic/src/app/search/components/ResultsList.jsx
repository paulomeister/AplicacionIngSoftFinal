'use client';
import React, { useState, useEffect } from "react";
import {ResultItem} from "./ResultItem";
import {conection} from "./conection";

export const ResultsList = ({busqueda}) => {
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
  }
  //----------------------------------------------------------------------------------------------------------------------

  // ------- Llamada a la API -------
  useEffect(() => {
    if (busqueda) {
      getResults();
    }
  }, [busqueda]);

  //------- Manejo del estado de carga -------------
  if (loading) {
    return <div>Cargando...</div>;
  }

  // ----------- Manejo de errores --------------
  if (error) {
    return <div>Error: {error}</div>;
  }

  // --------- Manejo de caso en el que no haya resultados --------
  if (results.length === 0) {
    return <div>No se encontraron documentos</div>;
  }

  return (
    <div className="results-list">
        <div>
          <ResultItem results={results} />
        </div>
    </div>
  );
};
