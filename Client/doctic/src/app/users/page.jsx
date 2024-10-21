'use client';
import React, { useState, useEffect } from 'react';
import AuthorInfo from './components/AuthorInfo';
import DocumentList from './components/DocumentList';
import './Page.css'; 
import conectionUser from './utils/conectionUser';

function UserPage() {
  const [autor, setAutor] = useState({});

  const getAuthorInfo = async () => {
    const response = await conectionUser();
    setAutor(response);
  };

  useEffect(() => {
    getAuthorInfo();
  }, []);

  return (
    <div className="app">
      <AuthorInfo autor={autor} />
      <DocumentList autor={autor} />
    </div>
  );
}

export default UserPage;
