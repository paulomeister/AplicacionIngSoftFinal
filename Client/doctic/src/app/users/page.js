import React from 'react';
import Header from './components/Header';
import AuthorInfo from './components/AuthorInfo';
import DocumentList from './components/DocumentList';
import Footer from './components/Footer';
import './Page.css'; 

function userPage() {
  return (
    <div className="app">
      <Header />
      <div className="app-info">
        <AuthorInfo />
        <DocumentList />
      </div>
      <Footer />
    </div>
  );
}

export default userPage;  
