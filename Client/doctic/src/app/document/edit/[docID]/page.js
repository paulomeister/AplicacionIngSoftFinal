'use client';

import { useEffect, useState } from 'react';
import { instance } from 'app/app/api/axios'; // Importamos Axios configurado
import { SpinerComp } from 'app/app/document/[id]/components/SpinnerComp'; // Componente de carga
import { AlertPop } from 'app/app/document/[id]/components/AlertPop'; // Componente de error
import { UpdatePublicationForm } from './components/editDocument';

export default function DocumentById({ params }) {
  const docID = params.docID; // Obtenemos el ID del documento desde la URL
  const [documentData, setDocumentData] = useState(null); // Estado para almacenar los datos del documento
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    // Función para obtener los datos del documento desde la API
    const fetchDocument = async () => {
      try {
        const response = await instance.get(`/Documentos/id/${docID}`);
        setDocumentData(response.data); // Almacenamos los datos del documento
        setError(null); // Limpiamos cualquier error
      } catch (error) {
        if (error.response) {
          setError(error.response.data || 'Error al cargar los datos.');
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false); // Desactivamos el estado de carga
      }
    };

    fetchDocument(); // Llamamos a la función para obtener los datos del documento
  }, [docID]); // Se ejecuta cuando cambia el docID

  if (loading) {
    return <SpinerComp />; // Mostramos un spinner mientras se cargan los datos
  }

  if (error) {
    return <AlertPop error={error} />; // Mostramos un mensaje de error si hay problemas
  }

  return (
    <>
      {/* Enviamos los datos al componente UpdatePublicationForm */}
      <UpdatePublicationForm documentData={documentData} docID={docID} />
    </>
  );
}






