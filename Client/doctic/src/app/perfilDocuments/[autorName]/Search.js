import { useState } from "react";
import { FaSearch } from "react-icons/fa"; 

export default function Search({ setSearchTitle, setFilterCategory, setFilterIdioma, setFilterDates }) {
  const [showFilters, setShowFilters] = useState(false); // Estado para mostrar/ocultar los filtros
  const [searchQuery, setSearchQuery] = useState("");   // Estado para la barra de búsqueda
  const [filters, setFilters] = useState([]); // Estado para manejar múltiples filtros
  const [selectedIdioma, setSelectedIdioma] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });  // Estado para el rango de fechas

  const toggleFilters = () => {
    setShowFilters(!showFilters);  // Cambia el estado al hacer click
  };

  // Función para agregar un nuevo filtro
  const handleAddFilter = () => {
    setFilters([...filters, { id: Date.now(), type: "categoria", value: "" }]); // Añade un filtro nuevo por defecto "categoria"
  };

  // Función para eliminar un filtro
  const handleRemoveFilter = (id) => {
    setFilters(filters.filter((filter) => filter.id !== id)); // Elimina el filtro por su id
  };

  // Función para actualizar el tipo de filtro
  const handleFilterTypeChange = (id, newType) => {
    setFilters(filters.map((filter) =>
      filter.id === id ? { ...filter, type: newType, value: "" } : filter
    ));
  };

  // Función para manejar la búsqueda cuando se presiona el botón de "Buscar"
  const handleSearch = () => {
    setSearchTitle(searchQuery); // Envía el valor de searchQuery al componente padre

    // Filtrar las categorías de los filtros actuales
    const selectedCategories = filters
      .filter((filter) => filter.type === "categoria")
      .map((filter) => filter.value);

    setFilterCategory(selectedCategories); // Envía las categorías seleccionadas al componente padre

    setFilterIdioma(selectedIdioma); // Envía el idioma seleccionado al componente padre como string

    setFilterDates(dateRange);  // Envía las fechas seleccionadas al componente padre como rango de fechas
  };

  // Función para actualizar el valor del filtro
  const handleFilterValueChange = (id, value) => {
    setFilters(filters.map((filter) =>
      filter.id === id ? { ...filter, value } : filter
    ));
  };

  // Función para actualizar las fechas
  const handleDateChange = (key, value) => {
    setDateRange(prevState => ({
      ...prevState,
      [key]: value  // Actualiza el rango de fechas (desde o hasta)
    }));
  };

  return (
   <div className="container mx-auto p-6 flex-grow bg-[#DFE4F8] rounded relative mt-8 shadow-lg">
          
      {/* Barra de Búsqueda */}
  <div className="relative flex items-center">
    {/* Ícono FaSearch posicionado dentro del input */}
    <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
      <FaSearch className="text-gray-400" />
    </div>
    
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el estado al escribir en la barra
      placeholder="Buscar algo..."
      className="w-full p-6 pl-12 rounded-full bg-white focus:outline-none focus:ring-4 focus:ring-blue-600 text-lg"
    />
  </div>

      {/* Botón estilo "pestaña" para abrir/cerrar filtros */}
      <button
          onClick={toggleFilters}
          className="absolute left-1/2 transform -translate-x-1/2 bottom-[-20px] bg-[#DFE4F8] text-gray-700 rounded-b-full px-8 py-2 focus:outline-none"
      >
          {showFilters ? "Cerrar filtro" : "Abrir filtro"}
      </button>

      {/* Sección de filtros */}
      {showFilters && (
          <div className="mt-12 p-6 bg-[#DFE4F8] rounded-b-lg shadow-lg">
          
          {/* Lista de filtros dinámicos */}
          {filters.map((filter) => (
              <div key={filter.id} className="flex gap-4 items-center mb-4">
              
              {/* Selector de tipo de filtro */}
              <select
                  className="p-4 bg-white rounded-md w-1/4"
                  value={filter.type}
                  onChange={(e) => handleFilterTypeChange(filter.id, e.target.value)}
              >
                  <option value="categoria">Filtrar por Categoría</option>
                  <option value="idioma">Filtrar por Idioma</option>
                  <option value="fecha">Filtrar por Fechas</option>
              </select>

              {/* Renderiza el input basado en el tipo de filtro seleccionado */}
              {filter.type === "categoria" ? (
                  <input
                  type="text"
                  className="p-4 bg-white rounded-md flex-grow"
                  placeholder="Escribir Categoría"
                  value={filter.value}
                  onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
                  />
              ) : filter.type === "idioma" ? (
                <input
                type="text"
                className="p-4 bg-white rounded-md flex-grow"
                placeholder="Escribir Idioma"
                value={selectedIdioma}  // Usamos el estado `selectedIdioma`
                onChange={(e) => setSelectedIdioma(e.target.value)}  // Actualiza el idioma
                /> 
              
              ) : filter.type === "fecha" ? (
                  <div className="flex flex-col gap-2">
                  <label>
                      Desde (Año):
                      <input
                      type="number"
                      className="p-2 bg-white rounded-md"
                      value={dateRange.from || ""}
                      onChange={(e) => handleDateChange("from", e.target.value)}  // Actualiza el año de inicio
                      />
                  </label>
                  <label>
                      Hasta (Año):
                      <input
                      type="number"
                      className="p-2 bg-white rounded-md"
                      value={dateRange.to || ""}
                      onChange={(e) => handleDateChange("to", e.target.value)}  // Actualiza el año de finalización
                      />
                  </label>
                  </div>
              ) : null}

              {/* Botón para eliminar el filtro */}
              <button 
                  onClick={() => handleRemoveFilter(filter.id)} // Elimina el filtro
                  className="p-2 text-red-500">
                  <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                  ></path>
                  </svg>
              </button>
              </div>
          ))}

          {/* Botón para agregar un nuevo filtro */}
          <button 
              onClick={handleAddFilter} 
              className="mt-4 text-blue-600 text-lg">
              + Agregar nuevo filtro
          </button>
          </div>
      )}

      {/* Botón de Búsqueda */}
      <div className="mt-6">
          <button 
          onClick={handleSearch}
          className="w-full p-4 bg-blue-500 text-white rounded-lg text-xl focus:outline-none focus:ring-4 focus:ring-blue-500">
          Buscar
          </button>
      </div>
    </div>
  );
}




