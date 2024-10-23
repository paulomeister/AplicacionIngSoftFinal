'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Importar useRouter
import AuthorInfo from './components/AuthorInfo';
import DocumentList from './components/DocumentList';
import conectionUser from './utils/conectionUser';

function App() {
  const router = useRouter(); // Crear instancia de useRouter
  const [autor, setAutor] = useState({});
  const [username, setUsername] = useState('');

  const getUsername = () => {
    const { username } = router.query; // Obtener username de la URL
    if (username) {
      setUsername(username); // Actualizar el estado
    }
  };

  const getAuthorInfo = async () => {
    if (username) {
      const response = await conectionUser(username);
      setAutor(response);
    }
  };

  useEffect(() => {
    getUsername();
  }, [router.query]); // Ejecutar cuando router.query cambie

  useEffect(() => {
    getAuthorInfo();
  }, [username]); // Ejecutar cuando el username cambie

  return (
    <div className="app">
      <AuthorInfo autor={autor} />
      <DocumentList autor={autor} />
    </div>
  );
}

export default App;
