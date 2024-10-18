'use client';
import React from 'react';
import './SortMenu.css';

export const SortMenu = () => {
  return (
    <div className="sort-menu">
      <ul className="sort-options">
        <li>Relevancia</li>
        <li>Fecha (ascendente)</li>
        <li>Fecha (descendente)</li>
        <li>Valoración (ascendente)</li>
        <li>Valoración (descendente)</li>
        <li>Más vistos</li>
        <li >Menos vistos</li>
      </ul>
    </div>
  );
};
