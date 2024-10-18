"use client";

import { useState } from "react";

export default function Form() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    category: "",
    language: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("keywords", formData.keywords);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("language", formData.language);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        alert("Formulario enviado con éxito");
      } else {
        alert("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar el formulario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black p-6 rounded-md shadow-lg w-full max-w-md mx-auto"
      encType="multipart/form-data"
    >
      <h1 className="text-center text-xl font-bold mb-6">
        PUBLICA TU DOCUMENTO
      </h1>
      
      <div className="mb-4 text-center">
        <label className="block mb-2">Selecciona el Documento Para Subir</label>
        <input
          className="w-full p-2 border-dashed border-2 border-gray-300 rounded-md"
          type="file"
          id="file"
          name="file"
          onChange={handleChange}
          required
        />
        <p className="text-sm text-gray-500 mt-2">
          Tipos de archivos compatibles: .pdf
        </p>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Título (Requerido)
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          id="title"
          name="title"
          placeholder="Ingresa el título"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Descripción (Requerido)
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          id="description"
          name="description"
          rows="4"
          placeholder="Escribe una descripción"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keywords">
          Palabras Claves
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          id="keywords"
          name="keywords"
          placeholder="Palabras claves"
          value={formData.keywords}
          onChange={handleChange}
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Categoría (Requerido)
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          <option value="categoria1">Categoría 1</option>
          <option value="categoria2">Categoría 2</option>
          {/* Agrega más opciones según sea necesario */}
        </select>
      </div>

      {/* Language */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
          Idioma (Requerido)
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          {/* Agrega más idiomas según sea necesario */}
        </select>
      </div>

      {/* Submit */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <input
            type="checkbox"
            id="private"
            name="private"
            className="mr-2"
          />
          <label htmlFor="private" className="text-gray-700 text-sm">
            Publicar de manera privada
          </label>
        </div>
        <button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500"
          type="submit"
        >
          Publicar
        </button>
      </div>

      <button
        type="reset"
        className="text-red-600 hover:text-red-800 text-sm underline"
      >
        Eliminar
      </button>
    </form>
  );
}
