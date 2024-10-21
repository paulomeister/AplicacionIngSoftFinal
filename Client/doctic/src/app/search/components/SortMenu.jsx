'use client';
import React from 'react';
import './SortMenu.css';

const SortMenu = ({ onSortChange }) => {
  const handleSort = (sortOption) => {
    onSortChange(sortOption); 
  };

  return (
    <div className="sort-menu">
      <ul className="sort-options">
        <li onClick={() => handleSort("alfabetico")}>Alfabetico [A - Z]</li>
        <li onClick={() => handleSort("alfabetico-inverso")}>Alfabetico [Z - A]</li>
        <li onClick={() => handleSort("fecha-asc")}>Fecha (ascendente)</li>
        <li onClick={() => handleSort("fecha-desc")}>Fecha (descendente)</li>
        <li onClick={() => handleSort("valoracion-asc")}>Valoración (ascendente)</li>
        <li onClick={() => handleSort("valoracion-desc")}>Valoración (descendente)</li>
      </ul>
    </div>
  );
};

export default SortMenu;
