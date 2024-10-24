"use client";

import { instance } from "app/app/api/axios";
import { useState, useEffect, useRef } from "react";
// import { Modal, Spinner, Alert, Form, Badge } from "react-bootstrap";
import { Spinner, Alert, Form, Badge } from "react-bootstrap";
import axios from "axios";
import { AuthorForm } from "./AuthorForm";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export const PublicationForm = () => {
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
  const [modalSuccedSubmit, setModalSuccedSubmit] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías obtenidas de la API
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]); // Estado para almacenar las subcategorías
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para manejar la categoría seleccionada
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Estado para manejar la subcategoría seleccionada
  //const [selectedSubcategories, setSelectedSubcategories] = useState([]); // Almacenar múltiples subcategorías seleccionadas
  const [selectedCategoryWithId, setSelectedCategoryWithId] = useState({}); // Almacenar categoría seleccionada con ID
  const [selectedSubcategoriesWithId, setSelectedSubcategoriesWithId] =
    useState([]); // Almacenar subcategorías con ID
  
    const handleOpen = () => {
      onOpen();
    }
    
    useEffect(() => {
      if(modalSuccedSubmit) {
        handleOpen();
      }
    }, [modalSuccedSubmit]);

    const handleLoading = () => {
      onOpen();
    }

    useEffect(() => {
      if(loading) {
        handleLoading();
      }
    }, [loading]);

  const onAuthorSubmit = (selectedAuthors) => {
    setSelectedAuthors(selectedAuthors); // actualiza el SelectedAuthors de este componente
  };

  // Fetch a la API para obtener las categorías
  useEffect(() => {
    setModalSuccedSubmit(false);
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
      console.log(response.data);
      console.log(
        "Subcategorías obtenidas:",
        response.data[0].subCategorias[0]?.nombre
      ); // Log del JSON de subcategorías
      // Almacenar la categoría seleccionada con ID y nombre
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
    console.log(selectedCategory);
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

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

    if (file && file.size > maxFileSize) {
      setFileError("El archivo cargado excede el tamaño máximo de 2MB.");
      fileInputRef.current.value = ""; // Clear the input
    } else {
      setFileError(null);
      // Puedes manejar el archivo aquí si es válido
      console.log("Archivo subido correctamente:", file);
    }
  };

  const formHandler = (event) => {
    event.preventDefault();

    const { title, description, visibility } = event.target;
    const inputTitle = title.value;
    const inputDescription = description.value;
    const inputPDF = fileInputRef.current.files[0];
    const inputVisibility = visibility.value;

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

    console.log(selectedAuthors);

    const document = {
      titulo: inputTitle,
      descripcion: inputDescription,
      visibilidad: inputVisibility,
      categoria: categoriasFinal,
      autores: selectedAuthors,
      fechaSubida: new Date(),
      year: new Date().getFullYear()
    };

    const data = new FormData();
    data.append("file", inputPDF);
    data.append("document", JSON.stringify(document));

    setLoading(true);
    setError(null);

    instance
      .post("/Documentos/insert", data)
      .then((response) => {
        console.log(response.data);
        setModalSuccedSubmit(true);
      })
      .catch((e) => {
        console.log(
          "Error al enviar el documento:",
          e.response ? e.response.data : e.message
        );
        setError(`Error: ${e.response ? e.response.statusText : e.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section
      aria-labelledby="publication-form-heading"
      className="max-w-screen-md w-[768px]"
    >   
      <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onclose) => {
              if(loading) {
                return (
                  <>
                    <ModalBody>
                      <Spinner animation="border" role="status" />
                    </ModalBody>
                  </>
                );
              } else if(modalSuccedSubmit) {
                return (
                  <>
                    <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader>
                          ¡Creación de documento exitosa!
                        </ModalHeader>
                      </>
                    )}
                    </ModalContent>
                  </>
                );
              }
            }}
          </ModalContent>
      </Modal>


        

      {/* Mensaje de error */}
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 id="publication-form-heading" className="text-4xl font-bold mb-4">
        Crear Publicación
      </h1>
      <form onSubmit={formHandler}>
        <p id="form-description" className="text-xl text-gray-600 mb-4">
          Por favor completa el formulario a continuación para crear una nueva
          publicación.
        </p>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="title"
          >
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
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="description"
          >
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
            style={{ minHeight: "80px", maxHeight: "400px", overflow: "auto" }}
          ></textarea>
          <span className="text-gray-500 text-sm">Máximo 800 caracteres</span>
        </div>

        {/* Campo de selección de categoría */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="category"
          >
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
            <p
              className="block text-gray-700 text-lg font-bold mb-2"
              htmlFor="subcategory"
            >
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
                    variant="secondary"
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
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="file"
          >
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
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <span className="text-gray-500 text-sm">Tamaño máximo de 2MB</span>
          <span className="text-red-500 text-sm ml-2">{fileError}</span>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="visibility"
          >
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
            className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            type="submit"
          >
            Crear Publicación
          </button>
        </div>
      </form>
    </section>
  );
};
