'use client';
import React, { useState, useEffect } from 'react';
import conectionUser from '../utils/conectionUser';
import conectionDocuments from '../utils/conectionDocuments';
import DocumentItem from './DocumentItem';
import './DocumentList.css';

const DocumentList = () => {
  const [titulosDocumentos, setTitulosDocumentos] = useState([]);
  const [infDocumentos, setInfDocumentos] = useState([]);
  const [loading, setLoading] = useState(true); // Añadir estado de carga para mejor manejo

  const getDocumentos = async () => {
    try {
      // Primera llamada para obtener los títulos de los documentos
      const response = await conectionUser();
      setTitulosDocumentos(response.docSubidos); // Ajusta según la estructura de la respuesta
    } catch (error) {
      console.log(error);
    }
  };

  // Segunda llamada para obtener la información completa de los documentos usando los títulos
  const fetchDocumentDetails = async () => {
    let docs = [];
    for (let i = 0; i < titulosDocumentos.length; i++) {
      try {
        const response = await conectionDocuments(titulosDocumentos[i].titulo);
        docs.push(response);
      } catch (error) {
        console.error(error);
      }
    }
    setInfDocumentos(docs);
    setLoading(false); // Finalizar el estado de carga
  };

  // Ejecutar las llamadas de forma controlada
  useEffect(() => {
    getDocumentos(); // Obtener los títulos de los documentos
  }, []); // Se ejecuta una sola vez al montar el componente

  useEffect(() => {
    if (titulosDocumentos.length > 0) {
      fetchDocumentDetails(); // Obtener detalles de los documentos cuando ya tengamos los títulos
    }
  }, [titulosDocumentos]); // Se ejecuta cuando titulosDocumentos cambia

  if (loading) {
    return <p>Cargando documentos...</p>; // Mostrar mensaje de carga
  }

  return (
    <div className="document-list">
      <DocumentItem results={infDocumentos} />
    </div>
  );
};

export default DocumentList;
