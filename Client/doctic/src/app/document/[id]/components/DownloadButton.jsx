"use client";
import { instance } from "app/app/api/axios";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Axios } from "axios";

export const DownloadButton = ({
  userId = "66ebbc56e9670a5556f9781a",
  documentId = "66f5cb78c4cd20cadab20054",
  fileId = "1h1moDyZaGABnwspsFgnJj_0OFDLeM9ZC",
  // url,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const downloadFile = async () => {
    setLoading(true);
    setError(null);
    setShowAlert(false); // Reset alert visibility

    const form = new FormData();
    form.append("fileId", fileId);
    form.append("userId", userId);
    form.append("documentId", documentId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/Documentos/downloadFile`,
        {
          method: "POST",
          body: form,
          headers: {
            Authorization:
<<<<<<< HEAD
              "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbnVuZXoiLCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU1VBUklPIn1dLCJpYXQiOjE3Mjk3MjIxOTYsImV4cCI6MTcyOTc0NjAwMH0.ULIjma7sXLM-i3PmE5aF5UOP9N81CwC6E04nbHZVifeOSovpTGU2El8HsHbJ0y3TDh3nvTPQmB9EsgY_cg_e7Q",
=======
              "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbnVuZXoiLCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU1VBUklPIn1dLCJpYXQiOjE3Mjk3Mjg0NTYsImV4cCI6MTcyOTc0NjAwMH0.HCBbGqwC1E1pd7d618gMfh3FPewM0OOGLflw-9ywmhcX7ZYGtqJQOv57zMYOfCwND9vXKxnPp1KclO-JX5iIeg",
>>>>>>> main
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      // Convierte la respuesta en un blob (archivo binario)
      const blob = await response.blob();

      // Crea una URL para el archivo descargado
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Extrae el nombre del archivo desde los headers
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "archivo.pdf"; // Si no hay filename, define uno por defecto

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Limpia el DOM
      document.body.removeChild(link);

      // Muestra alerta tras la descarga
      setShowAlert(true);
    } catch (e) {
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <p className="text-md">¿Quieres descargarlo?</p>
      <button
        onClick={downloadFile}
        className={`flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200`}
        aria-label="Descargar documento PDF"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Cargando..." : "Descargar PDF"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Alert for download success */}
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          El PDF se ha descargado con éxito.
        </Alert>
      )}
    </div>
  );
};
