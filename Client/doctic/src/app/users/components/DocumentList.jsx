'use client';
import React, { useState, useEffect } from 'react';
import conection from './conection';
import './DocumentList.css';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const response = await conection();
        setDocuments(response.docSubidos);
      } catch (error) {
        console.error(error);
      }
    };

    getDocuments();
  }, []);
  
  return (
    <div className="document-list">
      <h3>Documentos publicados</h3>
      <hr/>
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            <strong>{doc.title}</strong>
            <p>{doc.category}</p>
            <p>{doc.date}</p>
            <button>Ver</button>
            <button>Descargar</button>
          </li>
        ))}
      </ul>
      <button className="btn-ver-mas">Ver más</button>
    </div>
  );
};

export default DocumentList;
