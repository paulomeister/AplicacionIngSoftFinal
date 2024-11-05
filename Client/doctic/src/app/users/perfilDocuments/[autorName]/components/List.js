"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { SpinerComp } from "app/app/document/[id]/components/SpinnerComp";
import { DocumentListItem } from "./DocumentListItem";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Link from "next/link";
import Image from 'react-bootstrap/Image'; // Importamos Image desde React Bootstrap

export default function List({
  autorName,
  searchTitle,
  filterCategory,
  filterIdioma,
  filterDates,
  setAuthorNameFromList,
  propietario
}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 5; // Documentos por página

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/Documentos/onSearch/filter/",
        {
          titulo: searchTitle,
          tieneFiltros: true,
          categorias: filterCategory,
          autores: [autorName],
          idioma: filterIdioma,
          desde: filterDates.from ? parseInt(filterDates.from) : "",
          hasta: filterDates.to ? parseInt(filterDates.to) : "",
        }
      );
      setDocuments(response.data);

      if (response.data.length > 0) {
        const firstAuthorName = response.data[0].autores[0]?.nombre;
        setAuthorNameFromList(firstAuthorName);
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
      setCurrentPage(1);
    }
  }, [autorName, searchTitle, filterCategory, filterIdioma, filterDates]);

  const handleEdit = (id) => {
    return (
      <Link href={`/document/edit/${id}`}>
        <a>Editar Documento</a>
      </Link>
    );
  };

  const handleDelete = (id) => {
    async function fetchToDelete() {
      const data = await fetch(
        `http://localhost:8080/api/Documentos/delete/${id}`,
        { method: "DELETE" }
      );
      const response = await data.json();

      if (response.status === 200) {
        fetchDocuments();
      }
    }

    fetchToDelete();
  };

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);
  const totalPages = Math.ceil(documents.length / documentsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) return <SpinerComp />;
  if (error)
    return (
      <p className="text-center text-red-500 mt-8 text-lg">Error: {error}</p>
    );

  return (
    <div className="container p-6 flex-grow">
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-8">
        <Image 
          src="/No-Documents.jpg" 
          alt="No Documents" 
          fluid 
          style={{ maxWidth: "600px", height: "auto" }} 
        />
        <p className="text-lg text-gray-500 mt-4 text-center">No hay documentos publicados</p>
      </div>
      ) : (
        <>
          <ul className="space-y-8">
            {currentDocuments.map((doc) => (
              <DocumentListItem
                key={doc._id}
                doc={doc}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              ></DocumentListItem>
            ))}
          </ul>
          
          <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </div>
  );
}



