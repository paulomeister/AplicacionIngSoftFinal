'use client';
import React from 'react';
import { useState } from 'react';
import './SortMenu.css';

const SortMenu = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

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
