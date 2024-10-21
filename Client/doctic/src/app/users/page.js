import React from 'react';
import AuthorInfo from './components/AuthorInfo';
import DocumentList from './components/DocumentList';
import './Page.css'; 

function userPage() {
  return (
    <div className="app">
      <AuthorInfo />
      <DocumentList />
    </div>
  );
}

export default userPage;  
