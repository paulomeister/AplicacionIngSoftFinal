'use client';
import React from "react";
import "./ResultItem.css";

const ResultItem = ({ results }) => {
  return (
    <div>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h3><strong>{result.titulo}</strong></h3>

          {/* Renderizar autores */}
          <div className="result-params">
          <p><strong className="result-author">Subido por: </strong> 
            {result.autores?.map((autor, i) => (
              <span key={i}>{autor.nombre}, </span>
            ))}
          </p>
          </div>

          {/* Renderizar categoría */}
          <div className="result-params">
          <p><strong>Categorías: </strong>
          {result.categoria?.map((cat, i) => (
            <span key={i}>{cat.nombre}, </span>
          ))}</p>
          </div>

          <p><strong>Disponible desde:</strong> {new Date(result.fechaSubida).toLocaleDateString()}</p>

          <div className="result-actions">
            <button onClick={() => window.open(result.urlArchivo)}>Ver</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultItem;