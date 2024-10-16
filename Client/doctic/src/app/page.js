"use client";
import { useRef } from "react";

export default function Home() {
  const documentRef = useRef(null);

  const fetchData = async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe y la página se recargue

    const data = new FormData();
    const file = documentRef.current.files[0];
    
    // Asegúrate de que document esté disponible aquí
    const document = {
      _id: "123412341234123212341239",
      titulo: "Esto es una prueba",
      descripcion:
        "Un análisis sobre la aplicación de la inteligencia artificial en la gestión pública y sus implicaciones.",
      visibilidad: "publico",
      urlArchivo: "", // <----
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
         {
           usuarioId: "66ec6a0b33773bc9a9232552",
           rol: "coautor",
           username: "",
           nombre: "",
         },
         {
           usuarioId: "66ec6a1433773bc9a9232553",
           rol: "coautor",
           username: "",
           nombre: "",
         },
         {
           usuarioId: "66ec6a1b33773bc9a9232554",
           rol: "coautor",
           username: "",
           nombre: "",
         },
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
    }

    console.log(document)

    data.append("document", JSON.stringify(document)); // Asegúrate de que sea un JSON string
    data.append("file", file);

    try {
      
      const response = await fetch(
        "http://localhost:8080/api/Documentos/insert",
        {
          method: "POST",
          body: data,
        }
      );

      // Manejo de la respuesta
      if (!response.ok) {
        throw new Error("");
      }

      console.log(await response.json());
    } catch (e) {
      console.error(e.message); 
    }
  };

  return (
    <>
      <form
        id="prueba"
        onSubmit={fetchData} // Aquí se pasa la función correctamente
        style={{
          color: "white",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginTop: "200px",
        }}
      >
        <h1>Sube tu documento a DOCTIC</h1>
        <input
          type="file"
          id="inputDocument"
          accept=".pdf"
          required
          ref={documentRef}
        />
        <button
          style={{
            border: "1px solid white",
            margin: "30px",
            display: "block",
          }}
        >
          Enviar documento
        </button>
      </form>
    </>
  );
}