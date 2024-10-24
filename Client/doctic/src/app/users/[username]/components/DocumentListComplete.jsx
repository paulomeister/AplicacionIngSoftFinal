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
  
  // ----------- Llamada a la API para obtener la información completa de los documentos usando los títulos -------------
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
    setLoading(false); 
  };

  useEffect(() => {
    if (titulosDocumentos.length > 0) {
      fetchDocumentDetails(); 
    }
  }, [titulosDocumentos]); 

  useEffect(() => {
    setTitulosDocumentos(autor.docSubidos);
  }, [])
  
  if (loading) {
    return(
        <AlertPop loading={loading}/>
    )
  }
  else{
    return (
      <div className="document-list">
        <div className="document-list-title">
          <h1>Documentos Escritos por {autor.username}</h1>
        </div>
        <DocumentItem results={infDocumentos} />
      </div>
    );
  }
};

export default DocumentListComplete;
