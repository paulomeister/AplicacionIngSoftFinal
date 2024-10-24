// Función para extraer los datos del documento
export const extractDocumentData = (documentData) => {
    // Extraemos el título, descripción, visibilidad y URL directamente
    const titulo = documentData.titulo || "";
    const descripcion = documentData.descripcion || "";
    const visibilidad = documentData.visibilidad || "";
    const urlArchivo = documentData.urlArchivo || "";
  
    // Extraemos todos los autores (sus usuarioId)
    const autores = documentData.autores.map((autor) => autor.usuarioId);
  
    // Extraemos la categoría principal (la primera categoría en el array)
    const categoria = documentData.categoria.length > 0 ? {
      categoriaId: documentData.categoria[0].categoriaId,
      nombre: documentData.categoria[0].nombre
    } : { categoriaId: "", nombre: "" };
  
    // Extraemos las subcategorías (elementos a partir del índice 1 del array de categorías)
    const subcategorias = documentData.categoria.length > 1 ? 
      documentData.categoria.slice(1).map(subcat => ({
        categoriaId: subcat.categoriaId,
        nombre: subcat.nombre
      })) : [];
  
    // Retornamos un objeto con todos los datos extraídos
    return {
      titulo,
      descripcion,
      autores,
      categoria,
      subcategorias,
      visibilidad,
      urlArchivo
    };
  };
  
  // Si tienes un componente que renderiza el documento, asegúrate de exportarlo también:
  export default function BasicDocumentView({ documentData }) {
    const { titulo, descripcion, autores, categoria, subcategorias, visibilidad, urlArchivo } = extractDocumentData(documentData);
  
    return (
      <div>
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
  
        <h3>Autores</h3>
        <ul>
          {autores.map((autor, index) => (
            <li key={index}>{autor}</li>
          ))}
        </ul>
  
        <h3>Categoría</h3>
        <p>{categoria.nombre}</p>
  
        <h3>Subcategorías</h3>
        <ul>
          {subcategorias.map((subcat, index) => (
            <li key={index}>{subcat.nombre}</li>
          ))}
        </ul>
  
        <h3>Visibilidad</h3>
        <p>{visibilidad}</p>
  
        <h3>URL del archivo</h3>
        <a href={urlArchivo} target="_blank" rel="noopener noreferrer">
          Ver archivo
        </a>
      </div>
    );
  }
  
  
  