"use client";
import React from "react";
import Link from "next/link";
import "./DocumentItem.css";

const DocumentItem = ({ results }) => {
  return (
    <div>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <Link href={`/document/${result._id}`} className="document-title-author">
            <strong>{result.titulo}</strong>
          </Link>

          {/* Renderizar autores */}
          <div className="result-params">
            <p>
              <strong className="result-author">Autores: </strong>
              {result.autores?.map((autor, i) => (
                <Link
                  href={`/users/${autor.username}`}
                  className="result-author"
                  key={i}
                >
                  <span>
                    {autor.nombre}
                    {i < result.autores.length - 1 ? ", " : ""}{" "}
                  </span>
                </Link>
              ))}
            </p>
          </div>

          {/* Renderizar categoría */}
          <div className="result-params">
            <p>
              <strong>Categorías: </strong>
              {result.categoria?.map((cat, i) => (
                <span key={i}>
                  {cat.nombre}
                  {i < result.categoria.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </div>

          <p>
            <strong>Disponible desde:</strong>{" "}
            {new Date(result.fechaSubida).toLocaleDateString()}
          </p>

          <div className="result-actions">
            <button>
              <Link href={`/document/${result._id}`}>Ver</Link>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentItem;
