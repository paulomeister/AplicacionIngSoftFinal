'use client';
import React, { useState, useEffect } from 'react';
import './SortMenu.css';

const SortMenu = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem('sortCriteria') || 'alfabetico'); // Inicializado con "alfabetico"

  // Aplica el criterio de orden "alfabetico" por defecto al cargar el componente
  useEffect(() => {
    onSortChange(selectedOption); // Llama a la función de ordenamiento con el valor inicial
  }, [selectedOption, onSortChange]);

  const handleSort = (sortOption) => {
    setSelectedOption(sortOption);
    onSortChange(sortOption); 
  };

  return (
    <div className="sort-menu">
      <strong>Menú de ordenamiento</strong>
      <ul className="sort-options">
        <li className={selectedOption === 'alfabetico' ? 'selected' : ''} onClick={() => handleSort("alfabetico")}>
          Alfabetico [A - Z]
        </li>
        <li className={selectedOption === 'alfabetico-inverso' ? 'selected' : ''} onClick={() => handleSort("alfabetico-inverso")}>
          Alfabetico [Z - A]
        </li>
        <li className={selectedOption === 'fecha-asc' ? 'selected' : ''} onClick={() => handleSort("fecha-asc")}>
          Fecha (ascendente)
        </li>
        <li className={selectedOption === 'fecha-desc' ? 'selected' : ''} onClick={() => handleSort("fecha-desc")}>
          Fecha (descendente)
        </li>
        <li className={selectedOption === 'valoracion-asc' ? 'selected' : ''} onClick={() => handleSort("valoracion-asc")}>
          Valoración (ascendente)
        </li>
        <li className={selectedOption === 'valoracion-desc' ? 'selected' : ''} onClick={() => handleSort("valoracion-desc")}>
          Valoración (descendente)
        </li>
      </ul>
    </div>
  );
};

export default SortMenu;
