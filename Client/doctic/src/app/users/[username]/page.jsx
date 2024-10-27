'use client';
import React, { useState, useEffect } from 'react';
import AuthorInfo from './components/AuthorInfo';
import DocumentList from './components/DocumentList';
import DocumentListComplete from './components/DocumentListComplete';
import conectionUser from './utils/conectionUser';
import './page.css';

function App({ params }) {
  const [autor, setAutor] = useState({});
  const [username, setUsername] = useState('');
  const [verTodos, setVerTodos] = useState(false);

  // ------- Llamada a la API para obtener la información del autor -----------
  const getAuthorInfo = async () => {
    if (username) {
      const response = await conectionUser(username);
      setAutor(response);
    }
  };

  // ------- cambiar el valor de username desde URL cada vez que cambia el valor de params.username(users/[username]) --------
  useEffect(() => {
    if (params.username) {
      setUsername(params.username);
    }
  }, [params.username]);

  // ------- buscar usuario cuando cambia el valor de username --------
  useEffect(() => {
    getAuthorInfo(); 
  }, [username]);

  const handleVerTodos = () => {
    setVerTodos(true); 
  };

  return (
    <div id="back">
      {!verTodos && (
        <div className="app">
          <AuthorInfo autor={autor} />
          {<DocumentList autor={autor} onVerTodos={handleVerTodos} />}
        </div>
      )}

      {verTodos && <DocumentListComplete autor={autor} />}
    </div>
  );
}

export default App; 
