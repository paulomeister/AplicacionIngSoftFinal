'use client'

import { Alert } from 'react-bootstrap';

export const AlertPop = ({error}) => {
  return (
    <Alert variant="danger" className="h-auto">
        <Alert.Heading>Error al cargar los datos</Alert.Heading>
        <p>{error}</p>
    </Alert>
  )
}

export const AlertPopup = ({ message, type, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`rounded-lg p-4 shadow-lg ${
        type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
        'bg-blue-100 text-blue-800 border border-blue-200'
      }`}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};