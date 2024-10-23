"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { SpinerComp } from "app/app/document/[id]/components/SpinnerComp";
import { DocumentListItem } from "./DocumentListItem";

export default function List({
  autorName,
  searchTitle,
  filterCategory,
  filterIdioma,
  filterDates,
  setAuthorNameFromList,
}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FUNCTION FOR MODAL:

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/Documentos/onSearch/filter/",
        {
          titulo: searchTitle, // Aquí pasamos el título que viene del componente Search
          tieneFiltros: true,
          categorias: filterCategory,
          autores: [autorName],
          idioma: filterIdioma,
          desde: filterDates.from ? parseInt(filterDates.from) : "", // Convertir las fechas a enteros
          hasta: filterDates.to ? parseInt(filterDates.to) : "",
        }
      );
      setDocuments(response.data);

      // Si obtenemos documentos, actualizamos el nombre del autor
      if (response.data.length > 0) {
        const firstAuthorName = response.data[0].autores[0]?.nombre; // Obtenemos el primer autor
        setAuthorNameFromList(firstAuthorName); // Actualizamos el autor en PerfilDocuments
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
  }, [autorName, searchTitle, filterCategory, filterIdioma, filterDates]); // Actualiza la lista cuando cambie cualquier filtro

  const handleEdit = (id) => {
    // Funcionalidad futura para editar el documento
    console.log(`Editar documento con ID: ${id}`);
  };

  const handleDelete = (id) => {

    async function fetchToDelete() {

      const data=  await fetch(`http://localhost:8080/api/Documentos/delete/${id}`,{method:"DELETE"})
      const response = await data.json();

      if (response.status === 200) {
        fetchDocuments();
      } else {
        return;
      }

    }


    fetchToDelete();
  };

  if (loading) return <SpinerComp />;
  if (error)
    return (
      <p className="text-center text-red-500 mt-8 text-lg">Error: {error}</p>
    );

  return (
    <div className="container  p-6 flex-grow">
      <ul className="space-y-8">
        {documents.map((doc) => (
          <DocumentListItem
            key={doc._id}
            doc={doc}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          ></DocumentListItem>
        ))}
      </ul>
    </div>
  );
}
