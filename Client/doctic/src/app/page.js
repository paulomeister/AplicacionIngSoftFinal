"use client";
import { useRef } from "react";
export default function Home() {
  // Referencia al input de archivo para poder acceder al archivo seleccionado
  const documentRef = useRef(null);

 // Función que maneja la actualización del documento
const insertDocument = async (document, file) => {
  const data = new FormData(); // Se utiliza FormData para enviar datos de forma multipart
  data.append("document", JSON.stringify(document)); // Añadimos el documento como un string JSON

  // Credenciales del usuario
  const username = 'danielGomez';
  const password = 'CalamarRojo47';
  const credentials = btoa(`${username}:${password}`); // Codificación Base64 de las credenciales

  // Si hay un archivo, también lo añadimos al FormData y usamos el endpoint que actualiza archivo y campos
  if (file) {
    data.append("file", file); // Añadimos el archivo PDF al FormData
    return await fetch(
      "http://localhost:8080/api/Documentos/insert", // Endpoint para actualizar archivo y campos
      {
        method: "POST",
        headers: {
          'Authorization': `Basic ${credentials}`, // Añadir autenticación básica
          // Aquí no necesitas 'Content-Type' ya que fetch maneja el tipo cuando se usa FormData
        },
        body: data, // Se envían los datos
      }
    );
  } else {
    // Si no hay archivo, se usa el endpoint que actualiza solo los campos
    return await fetch("http://localhost:8080/api/Documentos/insert", {
      method: "POST",
      headers: {
        'Authorization': `Basic ${credentials}`, // Añadir autenticación básica
      },
      body: data, // Se envían los datos sin archivo
    });
  }
};


  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenimos que el formulario recargue la página

    // Recuperamos el archivo seleccionado desde el input de tipo file
    const file = documentRef.current.files[0];

    // Definimos el objeto documento con los datos que se van a actualizar
    const document = {
      titulo: "'ESTA ES OTRA PRUEBA",
      descripcion:
        "Un análisis sobre la aplicación de la inteligencia artificial en la gestión pública y sus implicaciones.",
      visibilidad: "publico",
      urlArchivo: "18sjxszpeMfF5tNd8wzfNqLD8LWQMZiCE", // URL de un archivo existente en la base de datos
      keywords: ["inteligencia artificial", "gestión pública", "IA"],
      categoria: [
        {
          categoriaId: "66e9d445d5125e904b101538",
          nombre: "IA",
        },
      ],
      autores: [
        {
          usuarioId: "66ebbc85e9670a5556f97822",
          rol: "principal",
          username: "yocana",
          nombre: "Yolvi Ocaña Fernández",
        },
        // Se pueden añadir más autores aquí
      ],
      valoraciones: [
        {
          usuarioId: "66ebbc85e9670a5556f9781d",
          fechaCreacion: "2021-10-10T00:00:00.000+00:00",
          puntuacion: 4.8,
          comentario:
            "Excelente aplicación de la IA en el sector público, con ejemplos muy útiles.",
        },
      ],
      fechaSubida: "2021-10-10T00:00:00.000+00:00",
      datosComputados: {
        descargasTotales: 0,
        valoracionPromedio: 4.8,
        comentariosTotales: 1,
      },
      idioma: "español",
    };

    // Llamada a la función que hace el fetch con la lógica adecuada para actualizar
    try {
      const response = await insertDocument(document, file); // Llama a la función con el documento y el archivo (si existe)

      console.log(await response.json()); // Mostrar la respuesta en consola
    } catch (e) {
      console.error(e.message); // Manejo de errores
    }
  };

  return (
    <div>
      <h1>This is the homepage</h1>
    </div>
  );
}
