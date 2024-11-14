"use client";

import { instance } from "app/app/api/axios";
import { useState, useEffect, useRef, useContext } from "react";
// import { Modal, Spinner, Alert, Form, Badge } from "react-bootstrap";
import { Spinner, Alert, Form, Badge } from "react-bootstrap";
import axios from "axios";
import { AuthorForm } from "./AuthorForm";
import { FaFileUpload, FaCheckCircle } from "react-icons/fa"; // Importamos el ícono de documento
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { AuthContext } from "app/app/context/AuthContext";
import { SpinerComp } from "../../[id]/components/SpinnerComp";

export const PublicationForm = () => {
  const { clientKey, isLoggedIn, isLoading } = useContext(AuthContext);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [modalSuccedSubmit, setModalSuccedSubmit] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedSubcategoriesWithId, setSelectedSubcategoriesWithId] =
    useState([]);
  const [title, setTitle] = useState(""); // Estado para el título
  const [subcategorias, setSubcategorias] = useState([]); // Estado para almacenar las subcategorías
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para manejar la categoría seleccionada
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Estado para manejar la subcategoría seleccionada
  //const [selectedSubcategories, setSelectedSubcategories] = useState([]); // Almacenar múltiples subcategorías seleccionadas
  const [selectedCategoryWithId, setSelectedCategoryWithId] = useState({}); // Almacenar categoría seleccionada con ID

  const handleOpen = () => {
    onOpen();
  };

  useEffect(() => {
    if (modalSuccedSubmit) {
      handleOpen();
    }
  }, [modalSuccedSubmit]);

  const handleLoading = () => {
    onOpen();
  };

  useEffect(() => {
    if (loading) {
      handleLoading();
    }
  }, [loading]);

  const onAuthorsChange = (selectedAuthors) => {
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
        setCategorias(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategorias();
  }, []);

  const fetchSubcategorias = async (categoria) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/Categorias/getSubcategoriesWithName/${categoria}`
      );
      setSelectedCategoryWithId({
        categoriaId: response.data[0].documentoId,
        nombre: response.data[0].nombre,
      });
      setSubcategorias(response.data[0].subCategorias);
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
      setError("Error al obtener subcategorías");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);

    if (selectedCategory) {
      fetchSubcategorias(selectedCategory);
    } else {
      setSubcategorias([]);
    }
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleSubcategoryAdd = () => {
    const selectedSubcategoryObj = subcategorias.find(
      (subcat) => subcat.nombre === selectedSubcategory
    );

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
      setSelectedSubcategory("");
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
    const maxFileSize = 2 * 1024 * 1024; // 2MB en bytes

    if (file && file.size > maxFileSize) {
      setFileError("El archivo cargado excede el tamaño máximo de 2MB.");
      fileInputRef.current.value = "";
      setSelectedFile(null);
    } else {
      setFileError(null);
      setSelectedFile(file);
      if (file) {
        const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileNameWithoutExtension); // Actualiza el título con el nombre del archivo
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileInputChange({ target: { files: [file] } });
  };

  const formHandler = (event) => {
    event.preventDefault();
  
    const { title, description, visibility } = event.target;
    const inputTitle = title.value;
    const inputDescription = description.value;
    const inputPDF = fileInputRef.current.files[0];
    const inputVisibility = visibility.value;
  
    if (!inputPDF) {
      setFileError("Por favor selecciona un archivo antes de enviar el formulario.");
      return;
    }
  
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
      titulo: inputTitle,
      descripcion: inputDescription,
      visibilidad: inputVisibility,
      categoria: categoriasFinal,
      autores: selectedAuthors,
      valoraciones: [],
      fechaSubida: new Date(),
      year: new Date().getFullYear(),
      datosComputados: {
    descargasTotales: 0,
    valoracionPromedio: 0,
    comentariosTotales: 0,
  }
    };
  
    const data = new FormData();
    data.append("file", inputPDF);
    data.append("document", JSON.stringify(document));
    setLoading(true);
    setError(null);
  
    instance
      .post("/Documentos/insert", data, {
        headers: { Authorization: clientKey },
      })
      .then((response) => {
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

  return isLoggedIn ? (
    <section
      aria-labelledby="publication-form-heading"
      className="max-w-screen-md w-[768px]"
    >
      <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => {
            if (loading) {
              return (
                <>
                  <ModalBody>
                    <Spinner animation="border" role="status" />
                  </ModalBody>
                </>
              );
            } else if (modalSuccedSubmit) {
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

        {/* Subir Archivo */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="file"
          >
            Sube un archivo (PDF)
          </label>
          <div
            className={`w-full p-6 border-2 ${
              dragging
                ? "border-blue-600 bg-blue-100"
                : selectedFile
                ? "border-green-500 bg-green-50"
                : "border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            } rounded-md flex flex-col items-center justify-center cursor-pointer`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              className="hidden"
              type="file"
              id="file"
              name="file"
              accept=".pdf"
              required
              aria-required="true"
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />

            {selectedFile ? (
              <>
                <FaCheckCircle size={32} className="text-green-500 mb-2" />
                <span className="text-lg font-medium text-green-600">
                  Archivo cargado:
                </span>
                <span className="text-gray-700 text-sm">
                  {selectedFile.name}
                </span>
              </>
            ) : (
              <>
                <FaFileUpload size={32} className="text-blue-500 mb-2" />
                <span className="text-lg font-medium text-teal-600">
                  Selecciona o arrastra un documento PDF aquí
                </span>
                <span className="text-gray-500 text-sm">Tamaño máximo 2MB</span>
              </>
            )}
          </div>

          {fileError && (
            <span className="text-red-500 text-sm ml-2">{fileError}</span>
          )}
        </div>

        {/* Titulo */}
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
            value={title} // Usamos el estado title
            onChange={(e) => setTitle(e.target.value)} // Permite cambiar el título si el usuario lo desea
            placeholder="Ingresa el título de la publicación"
            //required
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
        {/* Categoría */}
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

        {/* Subcategoría */}
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
                    onClick={() => RemoveSubcategory(subcategory.categoriaId)}
                    style={{ cursor: "pointer" }}
                  >
                    {subcategory.nombre} &times;
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <AuthorForm onAuthorsChange={onAuthorsChange} />

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
          <Button color="primary" auto size="lg" type="submit">
            Crear Publicación
          </Button>
        </div>
      </form>
    </section>
  ) : (
    () => (window.location.href = "/error404")
  );
};
