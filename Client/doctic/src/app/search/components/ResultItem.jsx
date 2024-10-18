'use client';
import React from "react";
import "./ResultItem.css";

export const ResultItem = ({ results }) => {
  return (
    <div>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h3>{result.titulo}</h3>

          {/* Renderizar autores */}
          <p><strong className="result-author">Subido por: </strong> 
            {result.autores.map((autor, i) => (
              <span key={i}>{autor.nombre}{i < result.autores.length - 1 ? ', ' : ''}</span>
            ))}
          </p>

          {/* Renderizar categoría */}
          <p>{result.categoria.map((cat, i) => (
            <span key={i}><strong>Categoría: </strong>{cat.nombre}{i < result.categoria.length - 1 ? ', ' : ''}</span>
          ))}</p>

          <p><strong>Disponible desde:</strong> {new Date(result.fechaSubida).toLocaleDateString()}</p>

          <div className="result-actions">
            <button onClick={() => window.open(result.urlArchivo)}>Ver</button>
            <button onClick={() => window.open(result.urlArchivo)}>Compartir</button>
            <button onClick={() => window.open(result.urlArchivo)}>Descargar</button>
          </div>
        </div>
      ))}
    </div>
  );
};
