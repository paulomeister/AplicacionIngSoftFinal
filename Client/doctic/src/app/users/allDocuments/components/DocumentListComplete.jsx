'use client';
import React, { useState, useEffect } from 'react';
import conectionUser from '../../utils/conectionUser';
import conectionDocuments from '../../utils/conectionDocuments';
import DocumentItem from '../../components/DocumentItem';
import { AlertPop } from '../../utils/AlertPopup';
import './DocumentListComplete.css';

const DocumentListComplete = () => {
  const [titulosDocumentos, setTitulosDocumentos] = useState([]);
  const [infDocumentos, setInfDocumentos] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  const getDocumentos = async () => {
    try {
      // ---------- Primera llamada para obtener los títulos de los documentos -------------
      const response = await conectionUser();
      setTitulosDocumentos(response.docSubidos); 
    } catch (error) {
      console.log(error);
    }
  };

  // ----------- Segunda llamada para obtener la información completa de los documentos usando los títulos -------------
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

  //-------- Ejecutar las llamadas de forma controlada ----------
  useEffect(() => {
    getDocumentos(); 
  }, []);

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

  return (
    <div className="document-list">
      <DocumentItem results={infDocumentos} />
    </div>
  );
};

export default DocumentListComplete;
