'use client'

import { instance } from "app/app/api/axios";
import { useState } from "react";
import { Modal, Spinner, Alert, Form, Badge} from "react-bootstrap";

export const PublicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");

  // Función para manejar la creación de keywords
  const handleKeywordAdd = (e) => {
    if (e.key === "Enter" && newKeyword.trim()) {
      e.preventDefault();
      
      if (selectedKeywords.length < 5 && !selectedKeywords.includes(newKeyword)) {
        setSelectedKeywords([...selectedKeywords, newKeyword.trim()]);
      }
      
      setNewKeyword(""); // Limpiar el input
    }
  };

  // Función para remover una keyword
  const removeKeyword = (keywordToRemove) => {
    setSelectedKeywords(selectedKeywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const formHandler = (event) => {
    event.preventDefault();
    const [inputTitle, inputDescription, inputKeywords, inputCategory, inputAuthors, inputPDF, inputVisibility] = event.target;

    const title = inputTitle.value;
    const description = inputDescription.value;
    // **** PENDIENTE CAPTURA DE CATEGORIAS Y SUBCATEGORIAS DE FORMA ADECUADA *****
    const category = inputCategory.value;
    // **** PENDIENTE CAPTURA DE AUTORES DE FORMA ADECUADA *****
    const Authors = inputAuthors.value;

    const visiblity = inputVisibility.value;

    const document = {
      titulo: title,
      descripcion: description,
      visibilidad: visiblity,
      keywords: selectedKeywords,
      // // Categoria y autores pendientes
      // categoria: [ {
      //   categoriaId: "66e9d445d5125e904b101538",
      //   nombre: "IA",
      // },],
      // TODO: Se debe verificar que tenga por lo menos un Autor
      // autores: [{
      //   usuarioId: "66ebbc85e9670a5556f97822",
      //   rol: "principal",
      //   username: "yocana",
      //   nombre: "Yolvi Ocaña Fernández",
      // },
      // ],
      // valoraciones: [{
      //   usuarioId: "66ebbc85e9670a5556f9781d",
      //   fechaCreacion: "2021-10-10T00:00:00.000+00:00",
      //   puntuacion: 4.8,
      //   comentario:
      //     "Excelente aplicación de la IA en el sector público, con ejemplos muy útiles.",
      // },],
      fechaSubida: Date.now(),
      // datosComputados: {
      //   descargasTotales: 0,
      //   valoracionPromedio: 0,
      //   comentariosTotales: 0,
      // },
      // idioma: "español",
      // year: new Date().getFullYear(),
    }


    const data = new FormData();
    const file = inputPDF.files[0];
    data.append("document", JSON.stringify(document));
    data.append("file", file);

    setLoading(true);
    setError(null);

    instance.post("/Documentos/insert", data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((e) => {
      setError(`Error: ${e.response ? e.response.statusText : e.message}`);
    })
    .finally(() => {
      setLoading(false);
    })
  };

  return (
    <section aria-labelledby="publication-form-heading" className="max-w-screen-md w-[768px]">
      <Modal show={loading} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" />
          <span className="sr-only">Cargando...</span>
        </Modal.Body>
      </Modal>

      {/* Mensaje de error */}
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 id="publication-form-heading" className="text-4xl font-bold mb-4">
        Crear Publicación
      </h1>
      <form
      onSubmit={formHandler}
      >
        <p id="form-description" className="text-xl text-gray-600 mb-4">
          Por favor completa el formulario a continuación para crear una nueva publicación.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="title">
              Título
          </label>
          <input
              className="w-full p-2 border border-gray-300 rounded-md"
              type="text"
              id="title"
              name="title"
              placeholder="Ingresa el título de la publicación"
              required
              aria-required="true"
              maxLength="150"
          />
          <span className="text-gray-500 text-sm">Máximo 150 caracteres</span>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="description">
                Descripción
            </label>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                id="description"
                name="description"
                rows="4"
                placeholder="Escribe una breve descripción de la publicación"
                required
                aria-required="true"
                maxLength="800"
                style={{ minHeight: '80px', maxHeight: '400px', overflow: 'auto' }}
            ></textarea>
            <span className="text-gray-500 text-sm">Máximo 800 caracteres</span>
        </div>

        <div className="mb-4">
        
          <label htmlFor="keywords" className="block text-gray-700 text-lg font-bold mb-2">Keywords</label>
          <Form.Control
          type="text"
          id="keywords"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={handleKeywordAdd}
          placeholder="Escribe una palabra clave y presiona Enter"
          disabled={selectedKeywords.length >= 5}
          maxLength={30}
          />
          <span className="text-gray-500 text-sm">Máximo 5 keywords</span>
          {/* Mostrar keywords seleccionadas */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {selectedKeywords.map((keyword, index) => (
              <Badge
                key={index}
                pill
                variant="primary"
                onClick={() => removeKeyword(keyword)}
                style={{ cursor: "pointer" }}
              >
                {keyword} &times;
              </Badge>
            ))}
          </div>
        </div>

        

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="category">
            Categoría
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            id="category"
            name="category"
            required
            aria-required="true"
          >
            <option value="">Selecciona una categoría</option>
            <option value="tecnología">Tecnología</option>
            <option value="ciencia">Ciencia</option>
            <option value="arte">Arte</option>
            <option value="negocios">Negocios</option>
            <option value="salud">Salud</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="authors">
            Autores
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            id="authors"
            name="authors"
            placeholder="Ingresa los autores separados por comas"
            required
            aria-required="true"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="file">
            Sube un archivo (PDF)
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="file"
            id="file"
            name="file"
            accept=".pdf"
            required
            aria-required="true"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="visibility">
            Visibilidad
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            id="visibility"
            name="visibility"
            required
            aria-required="true"
          >
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            type="submit"

          >
            Crear Publicación
          </button>
        </div>
      </form>
    </section>
  );
};
