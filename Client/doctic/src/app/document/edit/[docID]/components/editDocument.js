"use client";

import { instance } from "app/app/api/axios";
import { useState, useEffect, useRef } from "react";
import { Modal, Spinner, Alert, Badge } from "react-bootstrap";
import axios from "axios";
import { AuthorForm } from "app/app/document/new/components/AuthorForm";
import { extractDocumentData } from "./inputs"; // Importamos la función que extrae los datos del documento

export const UpdatePublicationForm = ({ documentData }) => {
  // Extraemos los valores iniciales de documentData
  const {
    titulo: initialTitle,
    descripcion: initialDescription,
    visibilidad: initialVisibility,
    urlArchivo: initialUrlArchivo,
    autores: initialAuthors,
    categoria: initialCategory,
    subcategorias: initialSubcategories,
  } = extractDocumentData(documentData);

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías obtenidas de la API
  const [selectedAuthors, setSelectedAuthors] = useState(initialAuthors);
  const [subcategorias, setSubcategorias] = useState(initialSubcategories || []); // Estado para almacenar las subcategorías
  const [selectedCategory, setSelectedCategory] = useState(initialCategory.nombre); // Estado para manejar la categoría seleccionada
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Estado para manejar la subcategoría seleccionada
  const [selectedCategoryWithId, setSelectedCategoryWithId] = useState(initialCategory); // Almacenar categoría seleccionada con ID
  const [selectedSubcategoriesWithId, setSelectedSubcategoriesWithId] = useState(initialSubcategories || []); // Almacenar subcategorías con ID

  // Estados para el título y descripción
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [visibility, setVisibility] = useState(initialVisibility);

  const onAuthorSubmit = (selectedAuthors) => {
    setSelectedAuthors(selectedAuthors); // actualiza el SelectedAuthors de este componente
  };

  // Fetch a la API para obtener las categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/Categorias/allDistinct"
        );
        setCategorias(response.data); // Almacena el array de categorías
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Fetch para obtener las subcategorías basadas en la categoría seleccionada
  const fetchSubcategorias = async (categoria) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/Categorias/getSubcategoriesWithName/${categoria}`
      );
      setSelectedCategoryWithId({
        categoriaId: response.data[0].documentoId,
        nombre: response.data[0].nombre,
      });
      setSubcategorias(response.data[0].subCategorias); // Almacenar subcategorías
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
      setError("Error al obtener subcategorías");
    }
  };

  // Manejo del cambio en la categoría seleccionada
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);

    if (selectedCategory) {
      // Llamamos al fetch de subcategorías
      fetchSubcategorias(selectedCategory);
    } else {
      setSubcategorias([]); // Limpiar subcategorías si no hay categoría seleccionada
    }
  };

  // Manejo del cambio en la subcategoría seleccionada
  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleSubcategoryAdd = () => {
    const selectedSubcategoryObj = subcategorias.find(
      (subcat) => subcat.nombre === selectedSubcategory
    );

    if (selectedSubcategoryObj) {
      // Mostrar el _id de la subcategoría seleccionada
      console.log("Subcategoría seleccionada _id:", selectedSubcategoryObj._id);
    }

    // Verifica si ya existe el objeto subcategoría seleccionado en el array
    if (
      selectedSubcategoryObj &&
      !selectedSubcategoriesWithId.some(
        (subcat) => subcat.categoriaId === selectedSubcategoryObj._id
      )
    ) {
      setSelectedSubcategoriesWithId([
        ...selectedSubcategoriesWithId,
        {
          categoriaId: selectedSubcategoryObj._id,
          nombre: selectedSubcategoryObj.nombre,
        },
      ]);
      setSelectedSubcategory(""); // Limpiar la selección de subcategoría
    }
  };

  const RemoveSubcategory = (categoriaId) => {
    setSelectedSubcategoriesWithId(
      selectedSubcategoriesWithId.filter(
        (subcat) => subcat.categoriaId !== categoriaId
      )
    );
  };

  const formHandler = (event) => {
    event.preventDefault();

    // Obtenemos los valores del formulario
    const inputPDF = fileInputRef.current.files[0];

    const categoriasFinal = [
        {
            categoriaId: selectedCategoryWithId.categoriaId,
            nombre: selectedCategoryWithId.nombre,
        },
        ...selectedSubcategoriesWithId.map((subcat) => ({
            categoriaId: subcat.categoriaId,
            nombre: subcat.nombre,
        })),
    ];

    const document = {
        titulo: title,
        descripcion: description,
        visibilidad: visibility,
        categoria: categoriasFinal,
        autores: selectedAuthors,
        fechaSubida: new Date(),
    };

    console.log(document);

    // Crear un objeto FormData
    const data = new FormData();
    
    // Si se ha seleccionado un archivo, lo añadimos al FormData
    if (inputPDF) {
        data.append("file", inputPDF);
    }

    // Añadimos el documento en formato JSON
    data.append("document", JSON.stringify(document));

    // Establecemos el estado de carga
    setLoading(true);
    setError(null);

    // Enviamos la solicitud PUT
    instance
      .put("/Documentos/updateDocWithFile", data)
      .then((response) => {
        console.log(response.data);
        // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
      })
      .catch((e) => {
        console.log("Error al actualizar el documento:", e.response ? e.response.data : e.message);
        setError(`Error: ${e.response ? e.response.statusText : e.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
};

  return (
    <section aria-labelledby="publication-form-heading" className="max-w-screen-md w-[768px]">
      <Modal show={loading} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status" />
          <span className="sr-only">Cargando...</span>
        </Modal.Body>
      </Modal>

      {error && <Alert variant="danger">{error}</Alert>}
      <h1 id="publication-form-heading" className="text-4xl font-bold mb-4">
        Actualizar Publicación
      </h1>
      <form onSubmit={formHandler}>
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="title">
            Título
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            id="title"
            name="title"
            value={title} // Usamos el estado "title" en lugar del valor inicial
            onChange={(e) => setTitle(e.target.value)} // Actualizamos el estado "title" cuando el usuario escribe
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="description">
            Descripción
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            id="description"
            name="description"
            value={description} // Usamos el estado "description"
            onChange={(e) => setDescription(e.target.value)} // Actualizamos el estado "description"
            rows="4"
            required
          />
        </div>

        {/* Campo de selección de categoría */}
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="category">
            Categoría
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            id="category"
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            aria-required="true"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de selección de subcategoría */}
        {subcategorias.length > 0 && (
          <div className="mb-4">
            <p className="block text-gray-700 text-lg font-bold mb-2" htmlFor="subcategory">
              Subcategoría
            </p>
            <div className="flex gap-2">
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                id="subcategory"
                name="subcategory"
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                aria-required="true"
              >
                <option value="">Selecciona una subcategoría</option>
                {subcategorias.map((subcategoria) => (
                  <option key={subcategoria._id} value={subcategoria.nombre}>
                    {subcategoria.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleSubcategoryAdd}
              >
                Añadir
              </button>
            </div>

            {/* Mostrar subcategorías seleccionadas como tags */}
            {selectedSubcategoriesWithId.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {selectedSubcategoriesWithId.map((subcategory, index) => (
                  <Badge
                    key={index}
                    pill
                    variant="primary"
                    onClick={() => RemoveSubcategory(subcategory.categoriaId)} // Lógica para eliminar subcategoría por ID
                    style={{ cursor: "pointer" }}
                  >
                    {subcategory.nombre} &times;
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <AuthorForm onAuthorSubmit={onAuthorSubmit} />

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
            ref={fileInputRef}
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
            value={visibility} // Usamos el estado "visibility"
            onChange={(e) => setVisibility(e.target.value)} // Actualizamos el estado "visibility"
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
            Actualizar Publicación
          </button>
        </div>
      </form>
    </section>
  );
};





