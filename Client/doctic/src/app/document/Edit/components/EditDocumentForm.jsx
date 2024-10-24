import React from 'react';
import FormField from './FormField';

const EditDocumentForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Título"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Título del documento"
        required
      />
      <FormField
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción del documento"
        type="textarea"
        required
      />
      {/* Agregar más campos según sea necesario */}
      <div className="flex justify-center">
        <button
          className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          type="submit"
        >
          Actualizar Documento
        </button>
      </div>
    </form>
  );
};

export default EditDocumentForm;