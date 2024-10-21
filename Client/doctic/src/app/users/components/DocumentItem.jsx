'use client';
import React from 'react';

const DocumentItem = ({ results }) => {
  return (
    <>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h3><strong>{result.titulo}</strong></h3>

          {/* Renderizar categoría */}
          <div className="result-params">
            <p><strong>Categorías: </strong>
            {result.categoria.map((cat, i) => (<span key={i}>{cat.nombre}, </span>))}
            </p>
          </div>

          <p><strong>Disponible desde:</strong> {new Date(result.fechaSubida).toLocaleDateString()}</p>

          <div className="result-actions">
            <button onClick={() => window.open(result.urlArchivo)}>Ver</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default DocumentItem;
