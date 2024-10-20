"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";

export default function List({ autorName, searchTitle, filterCategory, filterIdioma, filterDates, setAuthorNameFromList }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/Documentos/onSearch/filter/", {
        titulo: searchTitle,  // Aquí pasamos el título que viene del componente Search
        tieneFiltros: true,
        categorias: filterCategory,
        autores: [autorName],
        idioma: filterIdioma,
        desde: filterDates.from ? parseInt(filterDates.from) : "",  // Convertir las fechas a enteros
        hasta: filterDates.to ? parseInt(filterDates.to) : "",
      });
      setDocuments(response.data);
      
      // Si obtenemos documentos, actualizamos el nombre del autor
      if (response.data.length > 0) {
        const firstAuthorName = response.data[0].autores[0]?.nombre;  // Obtenemos el primer autor
        setAuthorNameFromList(firstAuthorName);  // Actualizamos el autor en PerfilDocuments
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autorName) {
      fetchDocuments();
    }
  }, [autorName, searchTitle, filterCategory, filterIdioma, filterDates]);  // Actualiza la lista cuando cambie cualquier filtro

  const handleEdit = (id) => {
    // Funcionalidad futura para editar el documento
    console.log(`Editar documento con ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Funcionalidad futura para eliminar el documento
    console.log(`Eliminar documento con ID: ${id}`);
  };

  if (loading) return <p className="text-center mt-8 text-lg">Cargando documentos...</p>;
  if (error) return <p className="text-center text-red-500 mt-8 text-lg">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 flex-grow">
      
      <ul className="space-y-8">
        {documents.map((doc) => (
          <li key={doc._id} className="p-6 bg-white rounded shadow-md border">
            <h2 className="text-2xl font-semibold mb-2">{doc.titulo}</h2>
            <p className="text-lg text-gray-700 mb-1">
              <span className="font-semibold">Subido por:</span> {doc.autores[0]?.nombre}
            </p>
            <p className="text-base text-gray-600 mb-2 font-semibold">
              {doc.categoria.map((cat) => cat.nombre).join(", ")}
            </p>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt />
                  <span>
                    {new Date(doc.fechaSubida).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href={`/document/${doc._id}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                  <FaEye /> Ver
                </Link>

                {/* Botón para Editar */}
                <button 
                  onClick={() => handleEdit(doc._id)} 
                  className="flex items-center gap-2 text-green-500 hover:underline"
                >
                  <FaEdit /> Editar
                </button>

                {/* Botón para Eliminar */}
                <button 
                  onClick={() => handleDelete(doc._id)} 
                  className="flex items-center gap-2 text-red-500 hover:underline"
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


