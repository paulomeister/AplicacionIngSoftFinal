"use client";

import { useState } from "react";

export default function Formulario() {
  const [datosFormulario, setDatosFormulario] = useState({
    titulo: "",
    descripcion: "",
    palabrasClaves: "",
    categoria: "",
    idioma: "",
    archivo: null,
  });

  const manejarCambio = (e) => {
    const { name, value, files } = e.target;
    setDatosFormulario({
      ...datosFormulario,
      [name]: files ? files[0] : value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const datosFormularioEnviar = new FormData();
    datosFormularioEnviar.append("titulo", datosFormulario.titulo);
    datosFormularioEnviar.append("descripcion", datosFormulario.descripcion);
    datosFormularioEnviar.append("palabrasClaves", datosFormulario.palabrasClaves);
    datosFormularioEnviar.append("categoria", datosFormulario.categoria);
    datosFormularioEnviar.append("idioma", datosFormulario.idioma);
    if (datosFormulario.archivo) {
      datosFormularioEnviar.append("archivo", datosFormulario.archivo);
    }

    try {
      const respuesta = await fetch("/api/subir", {
        method: "POST",
        body: datosFormularioEnviar,
      });
      if (respuesta.ok) {
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
      onSubmit={manejarEnvio}
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
          id="archivo"
          name="archivo"
          onChange={manejarCambio}
          required
        />
        <p className="text-sm text-gray-500 mt-2">
          Tipos de archivos compatibles: .pdf
        </p>
      </div>

      {/* Título */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titulo">
          Título (Requerido)
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          id="titulo"
          name="titulo"
          placeholder="Ingresa el título"
          value={datosFormulario.titulo}
          onChange={manejarCambio}
          required
        />
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
          Descripción (Requerido)
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          id="descripcion"
          name="descripcion"
          rows="4"
          placeholder="Escribe una descripción"
          value={datosFormulario.descripcion}
          onChange={manejarCambio}
          required
        ></textarea>
      </div>

      {/* Palabras Claves */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="palabrasClaves">
          Palabras Claves
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          id="palabrasClaves"
          name="palabrasClaves"
          placeholder="Palabras claves"
          value={datosFormulario.palabrasClaves}
          onChange={manejarCambio}
        />
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
          Categoría (Requerido)
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          id="categoria"
          name="categoria"
          value={datosFormulario.categoria}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccionar</option>
          <option value="categoria1">Categoría 1</option>
          <option value="categoria2">Categoría 2</option>
          {/* Agrega más opciones según sea necesario */}
        </select>
      </div>

      {/* Idioma */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idioma">
          Idioma (Requerido)
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          id="idioma"
          name="idioma"
          value={datosFormulario.idioma}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccionar</option>
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          {/* Agrega más idiomas según sea necesario */}
        </select>
      </div>

      {/* Enviar */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <input
            type="checkbox"
            id="privado"
            name="privado"
            className="mr-2"
          />
          <label htmlFor="privado" className="text-gray-700 text-sm">
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
