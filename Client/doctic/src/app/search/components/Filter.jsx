'use client';
import React, { useState } from "react";
import "./Filter.css";

const Filter = ({ onUpdateFilters, filtros }) => {
  const [filtrosAdicionales, setFiltrosAdicionales] = useState(filtros || []); // Estado para filtros dinámicos

  // -------- Función para agregar un nuevo filtro ----------
  const handleAgregarFiltro = () => {
    setFiltrosAdicionales((prevFiltros) => [
      ...prevFiltros,
      { id: prevFiltros.length, valor: "", tipo: null } // Tipo inicial nulo
    ]);
    onUpdateFilters(filtrosAdicionales);
  };
  //---------------------------------------------------------

  // -------- Función para manejar el cambio de valor en el input de cada filtro ----------
  const handleInputChange = (id, event) => {
    const { value } = event.target;

    // --------- Si el filtro es "DESDE" o "HASTA", solo permitir números y máximo 4 dígitos ----------
    if (["DESDE", "HASTA"].includes(filtrosAdicionales.find(f => f.id === id)?.tipo)) {
      if (/^\d{0,4}$/.test(value)) { 
        const nuevosFiltros = filtrosAdicionales.map((filtro) =>
          filtro.id === id ? { ...filtro, valor: value } : filtro
        );
        setFiltrosAdicionales(nuevosFiltros);
        onUpdateFilters(nuevosFiltros);
      }
    } else {
      const nuevosFiltros = filtrosAdicionales.map((filtro) =>
        filtro.id === id ? { ...filtro, valor: value } : filtro
      );
      setFiltrosAdicionales(nuevosFiltros);
      onUpdateFilters(nuevosFiltros);
    }
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

  const tiposSeleccionados = filtrosAdicionales.map((filtro) => filtro.tipo);

  return (
    <>
      {/* Renderiza los filtros adicionales */}
      {filtrosAdicionales.map((filtro) => (
        <div key={filtro.id} className="filter-item">
          <select className="filter-select" value={filtro.tipo || ''} onChange={(e) => handleTipoChange(filtro.id, e)}>
            <option value="" disabled>Selecciona filtro</option>
            <option value="AUTOR" disabled={tiposSeleccionados.includes("AUTOR")}>
              Autor
            </option>
            <option value="KEYWORDS" disabled={tiposSeleccionados.includes("KEYWORDS")}>
              Palabra clave
            </option>
            <option value="CATEGORIA" disabled={tiposSeleccionados.includes("CATEGORIA")}>
              Categoría
            </option>
            <option value="DESDE" disabled={tiposSeleccionados.includes("DESDE")}>
              Desde año
            </option>
            <option value="HASTA" disabled={tiposSeleccionados.includes("HASTA")}>
              Hasta año
            </option>
            <option value="IDIOMA" disabled={tiposSeleccionados.includes("IDIOMA")}>
              Idioma
            </option>
          </select>
          <input
            type="text"
            placeholder={
              filtro.tipo === "AUTOR" ? "Escriba el nombre del autor" : 
              filtro.tipo === "KEYWORDS" ? "Escriba una palabra clave" :
              filtro.tipo === "CATEGORIA" ? "Escriba la categoría" : 
              filtro.tipo === "DESDE" || filtro.tipo === "HASTA" ? "Escriba el año (ej. 2022)" : 
              filtro.tipo === "IDIOMA" ? "Escriba el idioma" : "Filtrar con..." 
            }
            className="filter-input"
            value={filtro.valor}
            onChange={(e) => handleInputChange(filtro.id, e)}
            disabled={!filtro.tipo}
          />
          {/* Botón de eliminar filtro */}
          <button className="filter-btn" onClick={() => handleEliminarFiltro(filtro.id)}>
            <strong>Eliminar</strong>
          </button>
        </div>
      ))}

      <div className="filter-buttons">
        {/* Botón para agregar un nuevo filtro */}
        <button className="filter-btn" onClick={handleAgregarFiltro}>
          <strong>Agregar nuevo filtro</strong>
        </button>

        {/* Muestra el botón de eliminar todos si hay filtros */}
        {filtrosAdicionales.length > 0 && (
          <button className="filter-btn" onClick={handleEliminarTodosFiltros}>
            <strong>Eliminar todos los filtros</strong>
          </button>
        )}
      </div>
    </>
  );
};

export default Filter;
