'use client';
import React, { useState, useEffect } from 'react';
import AuthorInfo from './components/AuthorInfo';
import DocumentList from './components/DocumentList';
import DocumentListComplete from './components/DocumentListComplete';
import conectionUser from './utils/conectionUser';

function App({ params }) {
  const [autor, setAutor] = useState({});
  const [username, setUsername] = useState('');
  const [verTodos, setVerTodos] = useState(false);

  const getAuthorInfo = async () => {
    if (username) {
      const response = await conectionUser(username);
      setAutor(response);
    }
  };

  // Este efecto ahora manejará directamente el cambio de params.username
  useEffect(() => {
    if (params.username) {
      setUsername(params.username); // Se asigna solo cuando cambia params.username
    }
  }, [params.username]);

  useEffect(() => {
    getAuthorInfo(); // Se ejecuta cuando cambia el username
  }, [username]);

  const handleVerTodos = () => {
    setVerTodos(true); 
  };

  return (
    <div className="app">
      {!verTodos && (
        <>
          <AuthorInfo autor={autor} />
          <DocumentList autor={autor} />
        </>
      )}
  
      {verTodos && <DocumentListComplete autor={autor} />}
  
      <button className="ver-todos-btn" onClick={handleVerTodos}>Ver todos</button>
    </div>
  );
}

export default App; 
