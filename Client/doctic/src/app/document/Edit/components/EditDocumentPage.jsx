// EditDocumentPage.js
'use client';

import { useEffect, useState } from 'react';
import { instance } from 'app/app/api/axios';
import { AlertPop } from './components/AlertPop';
import { SpinerComp } from './components/SpinnerComp';
import EditDocumentForm from './components/EditDocumentForm';

export default function EditDocumentPage({ params }) {
  const id = params.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    visibilidad: '',
    categoria: [],
    autores: [],
    urlArchivo: '',
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/Documentos/id/${id}`);
        setData(response.data);
        setFormData(response.data); // Cargar los datos en el formulario
      } catch (error) {
        setError(error.response?.data || 'Error al cargar los datos.');
      }
    };
    getData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.put(`/Documentos/update/${id}`, formData);
      alert('Documento actualizado con éxito');
    } catch (error) {
      setError(error.response?.data || 'Error al actualizar el documento.');
    }
  };

  if (error) {
    return <AlertPop error={error} />;
  }

  if (!data) {
    return <SpinerComp />;
  }

  return (
    <div className="container p-6">
      <h1 className="text-4xl font-bold mb-4">Editar Documento</h1>
      <p className="text-xl text-gray-600 mb-4">
        Por favor completa el formulario a continuación para editar el documento.
      </p>
      <EditDocumentForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}