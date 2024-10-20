'use client';
import React, { useState } from "react";
import "./Filter.css";

const Filter = ({ onUpdateFilters, filtros }) => {
  const [filtrosAdicionales, setFiltrosAdicionales] = useState(filtros || []); // Estado para filtros dinámicos

  // -------- Función para agregar un nuevo filtro ----------
  const handleAgregarFiltro = () => {
    setFiltrosAdicionales((prevFiltros) => [
      ...prevFiltros,
      { id: prevFiltros.length, valor: "", tipo: "AUTOR" } 
    ]);
    onUpdateFilters(filtrosAdicionales);
  };
  //---------------------------------------------------------

  // -------- Función para manejar el cambio de valor en el input de cada filtro ----------
  const handleInputChange = (id, event) => {
    const { value } = event.target;
    const nuevosFiltros = filtrosAdicionales.map((filtro) =>
      filtro.id === id ? { ...filtro, valor: value } : filtro
    );
    setFiltrosAdicionales(nuevosFiltros);
    onUpdateFilters(nuevosFiltros); 
  };
  //---------------------------------------------------------

  // -------- Función para manejar el cambio de tipo en el select de cada filtro ----------
  const handleTipoChange = (id, event) => {
    const { value } = event.target;
    const nuevosFiltros = filtrosAdicionales.map((filtro) =>
      filtro.id === id ? { ...filtro, tipo: value } : filtro
    );
    setFiltrosAdicionales(nuevosFiltros);
    onUpdateFilters(nuevosFiltros); 
  };
  //---------------------------------------------------------

  // -------- Función para eliminar un filtro individual ----------
  const handleEliminarFiltro = (id) => {
    const nuevosFiltros = filtrosAdicionales.filter((filtro) => filtro.id !== id); 

    setFiltrosAdicionales(nuevosFiltros);
    onUpdateFilters(nuevosFiltros); 
  };
  //---------------------------------------------------------

  // -------- Función para eliminar todos los filtros ----------
  const handleEliminarTodosFiltros = () => {
    setFiltrosAdicionales([]);
    onUpdateFilters([]); 
  };
  //---------------------------------------------------------

  return (
    <>
      {/* Renderiza los filtros adicionales */}
      {filtrosAdicionales.map((filtro) => (
        <div key={filtro.id} className="filter-item">
          <select
            className="filter-select"
            value={filtro.tipo}
            onChange={(e) => handleTipoChange(filtro.id, e)}
          >
            <option value="AUTOR">Autor</option>
            <option value="CATEGORIA">Categoría</option>
            <option value="DESDE">Desde año</option>
            <option value="HASTA">Hasta año</option>
            <option value="IDIOMA">Idioma</option>
          </select>
          <input
            type="text"
            placeholder={
              filtro.tipo === "AUTOR" ? "Escriba el nombre del autor": 
              filtro.tipo === "CATEGORIA" ? "Escriba la categoría": 
              filtro.tipo === "DESDE" || filtro.tipo === "HASTA" ? "Escriba el año (ej. 2022)": 
              filtro.tipo === "IDIOMA" ? "Escriba el idioma": "Filtrar con..." 
            }
            className="filter-input"
            value={filtro.valor}
            onChange={(e) => handleInputChange(filtro.id, e)} // Actualiza el valor del input
          />
          {/* Botón de eliminar filtro */}
          <button className="filter-btn" onClick={() => handleEliminarFiltro(filtro.id)}><strong>Eliminar</strong></button>
        </div>
      ))}

      <div className="filter-buttons">
        {/* Botón para agregar un nuevo filtro */}
        <button className="filter-btn" onClick={handleAgregarFiltro}>
          <strong>Agregar nuevo filtro</strong>
        </button>

        {/* Muestra el botón de eliminar todos si hay filtros */}
        {filtrosAdicionales.length > 0 && (
          <>
            <button className="filter-btn" onClick={handleEliminarTodosFiltros}>
              <strong>Eliminar todos los filtros</strong>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Filter;