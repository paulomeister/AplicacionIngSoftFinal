'use client';
import React, { useState, useEffect } from 'react';
import conectionDocuments from '../utils/conectionDocuments';
import DocumentItem from './DocumentItem';
import { AlertPop } from '../utils/AlertPopup';
import './DocumentListComplete.css';

const DocumentListComplete = ({autor}) => {
  const [titulosDocumentos, setTitulosDocumentos] = useState([]);
  const [infDocumentos, setInfDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------- Función para obtener los títulos de los documentos subidos por el autor ---------
  const getDocumentos = () => {
    if (autor.docSubidos && Array.isArray(autor.docSubidos)) {
      const limitedTitles = autor.docSubidos.slice(0, 5);
      setTitulosDocumentos(limitedTitles);
    }
  };

  // ------- Función para obtener la información completa de los documentos usando los títulos --------
  const fetchDocumentDetails = async () => {
    let docs = [];

    console.log(titulosDocumentos[0])


    for (let i = 0; i < titulosDocumentos.length; i++) {
      try {
        const response = await conectionDocuments(titulosDocumentos[i].documentoId);
        docs.push(response);
      } catch (error) {
        console.error(error);
      }
    }
    setInfDocumentos(docs);
    setLoading(false);
  };

  // ------- useEffect para ejecutar getDocumentos cuando el componente se monta --------
  useEffect(() => {
    getDocumentos();
  }, [autor]);

  // ------- useEffect para ejecutar fetchDocumentDetails cuando titulosDocumentos cambie -------
  useEffect(() => {
    if (titulosDocumentos.length > 0) {
      fetchDocumentDetails();
    }
  }, [titulosDocumentos]);
  
  if (loading) {
    return(
        <AlertPop loading={loading}/>
    )
  }
  else{
    return (
      <div className="document-list-complete">
        <div className="document-list-title">
          <h1>Documentos Escritos por {autor.username}</h1>
        </div>
        <DocumentItem results={infDocumentos} />
      </div>
    );
  }
};

export default DocumentListComplete;