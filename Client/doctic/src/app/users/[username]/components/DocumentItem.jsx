'use client';
import React from "react";
import Link from "next/link";
import { FaCalendarAlt, FaStar, FaEye} from "react-icons/fa";
import "./DocumentItem.css";

const DocumentItem = ({ results }) =>{

  const calcularPromedioValoracion = (valoraciones) => {
    if (!valoraciones || valoraciones.length === 0) {
      return 0;
    } else {
      const suma = valoraciones.reduce((total, valoracion) => total + valoracion.puntuacion, 0);
      return (suma / valoraciones.length).toFixed(1); // Redondeamos a un decimal
    }
  };

  return (
    <div>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h3><strong>{result.titulo}</strong></h3>

          {/* Renderizar autores */}
          <div className="result-authors">
            <p><strong className="result-author">Autores: </strong> 
              {result.autores?.map((autor, i) => (
                <Link href={`/users/${autor.username}`} className="author" key={i}> 
                <span>{autor.nombre}{i < result.autores.length - 1 ? ", " : ""} </span> 
                </Link>
              ))}
            </p>
          </div>

          {/* Renderizar categoría */}
          <div className="result-categories">
            <p><strong>Categorías: </strong>
            {result.categoria?.map((cat, i) => (
              <span key={i}>{cat.nombre}{i < result.categoria.length - 1 ? ", " : ""}</span>
            ))}</p>
          </div>

          {/* Renderizar fecha y valoración */}
          <div className="result-params">
            <div className="result-img">
              <div className="result-date">
                <FaCalendarAlt /> <p>{new Date(result.fechaSubida).toLocaleDateString()}</p>
              </div>
              <div className="result-rating">
                <FaStar /> <p>{calcularPromedioValoracion(result.valoraciones)}</p>
              </div>
            </div>
            <Link className="result-btns" href={`/document/${result._id}`}><FaEye /><p>Ver</p></Link>
          </div>
        </div>
      ))}
    </div>
  );
};


export default DocumentItem;