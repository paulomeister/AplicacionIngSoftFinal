'use client';  
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import conectionDocuments from '../utils/conectionDocuments';
import DocumentItem from './DocumentItem';
import { AlertPop } from '../utils/AlertPopup';
import './DocumentList.css';

const DocumentList = ({ autor }) => {
  const [titulosDocumentos, setTitulosDocumentos] = useState([]); 
  const [infDocumentos, setInfDocumentos] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const router = useRouter();  

  // -------- Función para obtener los títulos de los documentos subidos por el autor ---------
  const getDocumentos = () => {
    if (autor.docSubidos && Array.isArray(autor.docSubidos)) {
      const limitedTitles = autor.docSubidos.slice(0, 5);
      setTitulosDocumentos(limitedTitles); 
    }
  }

  // ------- Función para obtener la información completa de los documentos usando los títulos --------
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

  // ----- Redirección al hacer clic en el botón ------
  const handleRedirect = () => {
    router.push('/users/allDocuments'); 
  };

  // ----- Manejo de warning pop-ups ------
  if (loading || infDocumentos.length === 0) {
    return (
      <div className="results-error">
        <AlertPop loading={loading} infDocumentos={infDocumentos} /> 
      </div>
    )
  }
   // ------ Renderizado de Documentos ------
   else {
    return (
      <div className="document-list-container">
        <h2>Documentos Subidos Por {autor.username}</h2> 
        <div className="document-list">
          <DocumentItem results={infDocumentos} />
        </div>
        <button className="btn-ver-mas" onClick={handleRedirect}>Ver más</button> 
      </div>
    );
  }
};

export default DocumentList;