'use client'

import { instance } from "app/app/api/axios";
import { useState, useEffect } from "react";
import { Modal, Spinner, Alert, Form, Badge} from "react-bootstrap";
import axios from "axios";

export const PublicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías obtenidas de la API
  const [subcategorias, setSubcategorias] = useState([]); // Estado para almacenar las subcategorías
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para manejar la categoría seleccionada
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Estado para manejar la subcategoría seleccionada
  //const [selectedSubcategories, setSelectedSubcategories] = useState([]); // Almacenar múltiples subcategorías seleccionadas
  const [selectedCategoryWithId, setSelectedCategoryWithId] = useState({}); // Almacenar categoría seleccionada con ID
  const [selectedSubcategoriesWithId, setSelectedSubcategoriesWithId] = useState([]); // Almacenar subcategorías con ID






  // Fetch a la API para obtener las categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/Categorias/allDistinct");
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
      const response = await axios.get(`http://localhost:8080/api/Categorias/getSubcategoriesWithName/${categoria}`);
      console.log("Subcategorías obtenidas:", response.data[0].subCategorias[0].nombre); // Log del JSON de subcategorías
      
      // Almacenar la categoría seleccionada con ID y nombre
      setSelectedCategoryWithId({
        categoriaId: response.data[0].documentoId, 
        nombre: response.data[0].nombre,
      });
      
      setSubcategorias(response.data[0].subCategorias); // Almacenar subcategorías
    } catch (error) {
      console.error("Error fetching subcategories:", error);
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
    const selectedSubcategoryObj = subcategorias.find(subcat => subcat.nombre === selectedSubcategory);
  
    if (selectedSubcategoryObj) {
      // Mostrar el _id de la subcategoría seleccionada
      console.log("Subcategoría seleccionada _id:", selectedSubcategoryObj._id);
    }
    
    // Verifica si ya existe el objeto subcategoría seleccionado en el array
    if (selectedSubcategoryObj && !selectedSubcategoriesWithId.some(subcat => subcat.categoriaId === selectedSubcategoryObj._id)) {
      setSelectedSubcategoriesWithId([
        ...selectedSubcategoriesWithId,
        {
          categoriaId: selectedSubcategoryObj._id,
          nombre: selectedSubcategoryObj.nombre
        }
      ]);
      setSelectedSubcategory(""); // Limpiar la selección de subcategoría
    }
  };

  const RemoveSubcategory = (categoriaId) => {
    setSelectedSubcategoriesWithId(selectedSubcategoriesWithId.filter(subcat => subcat.categoriaId !== categoriaId));
  };
  

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

  const categoriasFinal = [
    {
      categoriaId: selectedCategoryWithId.categoriaId,
      nombre: selectedCategoryWithId.nombre
    },
    ...selectedSubcategoriesWithId.map(subcat => ({
      categoriaId: subcat.categoriaId,
      nombre: subcat.nombre
    }))
  ];

  

  // Función para imprimir categoriasFinal
  const printCategoriasFinal = () => {
    console.log("Categorias Finales:", document);
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

    const categoriasFinal = [
      {
        categoriaId: selectedCategoryWithId.categoriaId,
        nombre: selectedCategoryWithId.nombre
      },
      ...selectedSubcategoriesWithId.map(subcat => ({
        categoriaId: subcat.categoriaId,
        nombre: subcat.nombre
      }))
    ];
    

    

    
    // **** PENDIENTE CAPTURA DE AUTORES DE FORMA ADECUADA *****
    const Authors = inputAuthors.value;

    const visiblity = inputVisibility.value;

    const document = {
      titulo: title,
      descripcion: description,
      visibilidad: visiblity,
      keywords: selectedKeywords,
      // // Categoria y autores pendientes
      categoria: categoriasFinal,
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

    console.log("Documento a enviar:", document);

    

    

    


    const data = new FormData();
    const file = inputPDF?.files?.[0];
    data.append("document", JSON.stringify(document));
    data.append("file", file);

    setLoading(true);
    setError(null);

    instance.post("/Documentos/insert", data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((e) => {
      console.log("Error al enviar el documento:", e.response ? e.response.data : e.message);
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
              <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="subcategory">
                Subcategoría
              </label>
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
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
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

          <button
        onClick={printCategoriasFinal} // Llama a la función printCategoriasFinal al hacer clic
        className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
        type="button" // Cambié a type="button" para que no envíe el formulario
      >
        Probar
      </button>
          
          

       
  

        </div>
      </form>
    </section>
    

  );
};
